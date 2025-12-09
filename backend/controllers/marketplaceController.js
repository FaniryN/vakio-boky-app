import pool from "../config/db.js";
import paymentService from "../services/paymentService.js";

/**
 * Get all active products from the marketplace
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM marketplace
       WHERE status = 'active'
       ORDER BY created_at DESC`,
    );

    res.json({
      success: true,
      products: result.rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving products:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Create a new order for a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { product_id, quantity, shipping_address } = req.body;
    const userId = req.user.id;

    const productCheck = await client.query(
      `SELECT * FROM marketplace
       WHERE id = $1 AND status = 'active'`,
      [product_id],
    );

    if (productCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const product = productCheck.rows[0];

    if (product.stock_quantity < quantity) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Insufficient stock",
      });
    }

    const total_amount = product.price * quantity;

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, product_id, quantity, total_amount, status, shipping_address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, product_id, quantity, total_amount, "pending", shipping_address],
    );

    await client.query(
      `UPDATE marketplace
       SET stock_quantity = stock_quantity - $1
       WHERE id = $2`,
      [quantity, product_id],
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: orderResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  } finally {
    client.release();
  }
};

/**
 * Get details of a specific order for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getOrderDetails = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT o.*, p.name as product_name, p.price, p.image_url
       FROM orders o
       JOIN marketplace p ON o.product_id = p.id
       WHERE o.id = $1 AND o.user_id = $2`,
      [orderId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      order: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error retrieving order:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Process payment for an order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const processPayment = async (req, res) => {
  try {
    const { order_id, payment_method } = req.body;
    const userId = req.user.id;

    // Get order details
    const orderCheck = await pool.query(
      `SELECT o.* FROM orders o
        WHERE o.id = $1 AND o.user_id = $2`,
      [order_id, userId],
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    const order = orderCheck.rows[0];

    // Initiate payment with payment service
    const paymentResult = await paymentService.initiatePayment(
      order_id,
      payment_method,
      order.total_amount,
      'MGA' // Default to Malagasy Ariary
    );

    res.json({
      success: true,
      message: "Payment initiated successfully",
      payment: paymentResult,
    });
  } catch (error) {
    console.error("❌ Error processing payment:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

/**
 * Get all orders for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT o.*, p.name as product_name, p.image_url
       FROM orders o
       JOIN marketplace p ON o.product_id = p.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [userId],
    );

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving orders:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Add a new product to the marketplace (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category, image_url, file_url } =
      req.body;
    const userId = req.user.id;

    // Check if user is admin
    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const result = await pool.query(
      `INSERT INTO marketplace (name, description, price, stock_quantity, category, image_url, file_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, price, stock_quantity, category, image_url, file_url],
    );

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Update an existing product in the marketplace (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      description,
      price,
      stock_quantity,
      category,
      image_url,
      file_url,
      status,
    } = req.body;
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const result = await pool.query(
      `UPDATE marketplace
       SET name = $1, description = $2, price = $3, stock_quantity = $4,
           category = $5, image_url = $6, file_url = $7, status = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        name,
        description,
        price,
        stock_quantity,
        category,
        image_url,
        file_url,
        status,
        productId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Delete a product from the marketplace (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const ordersCheck = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE product_id = $1",
      [productId],
    );

    if (parseInt(ordersCheck.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete a product with associated orders",
      });
    }

    const result = await pool.query(
      "DELETE FROM marketplace WHERE id = $1 RETURNING *",
      [productId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Get all products for admin view (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllProductsAdmin = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const result = await pool.query(
      `SELECT * FROM marketplace
        ORDER BY created_at DESC`,
    );

    res.json({
      success: true,
      products: result.rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving admin products:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Get all orders for admin view (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const result = await pool.query(
      `SELECT o.*, p.name as product_name, p.image_url
        FROM orders o
        JOIN marketplace p ON o.product_id = p.id
        ORDER BY o.created_at DESC`,
    );

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving admin orders:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Confirm an order (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const confirmOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderId = req.params.id;
    const userId = req.user.id;

    const userCheck = await client.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const orderCheck = await client.query(
      `SELECT o.* FROM orders o WHERE o.id = $1`,
      [orderId],
    );

    if (orderCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    const order = orderCheck.rows[0];

    if (order.status === 'confirmed') {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Order is already confirmed",
      });
    }

    await client.query(
      `UPDATE orders
        SET status = $1, payment_status = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3`,
      ["confirmed", "paid", orderId],
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Order confirmed successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error confirming order:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  } finally {
    client.release();
  }
};

/**
 * Download ebook securely (only for purchased books)
 */
export const downloadEbook = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Check if user has purchased this ebook
    const purchaseCheck = await pool.query(
      `SELECT o.*, p.file_url, p.name as product_name
       FROM orders o
       JOIN marketplace p ON o.product_id = p.id
       WHERE o.user_id = $1 AND o.product_id = $2 AND o.status IN ('confirmed', 'paid')`,
      [userId, productId],
    );

    if (purchaseCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: "You have not purchased this ebook",
      });
    }

    const order = purchaseCheck.rows[0];

    if (!order.file_url) {
      return res.status(404).json({
        success: false,
        error: "Ebook file not found",
      });
    }

    // Log the download for analytics
    await pool.query(
      `INSERT INTO reading_sessions (user_id, book_id, start_time, end_time, pages_read, time_spent_minutes)
       VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, 0)
       ON CONFLICT DO NOTHING`,
      [userId, productId],
    );

    // For now, redirect to the file URL (in production, you might want to stream the file)
    res.json({
      success: true,
      downloadUrl: `http://localhost:5000${order.file_url}`,
      productName: order.product_name,
    });
  } catch (error) {
    console.error("❌ Error downloading ebook:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Approve a product (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const approveProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const result = await pool.query(
      `UPDATE marketplace
       SET status = 'approved', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [productId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product approved successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error approving product:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Reject a product (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const rejectProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { reason } = req.body;
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const result = await pool.query(
      `UPDATE marketplace
       SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [productId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product rejected successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error rejecting product:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Get all categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCategories = async (req, res) => {
  try {
    // For now, return categories from marketplace table
    // In production, you might want a separate categories table
    const result = await pool.query(
      `SELECT category as name, COUNT(*) as product_count
       FROM marketplace
       WHERE category IS NOT NULL AND category != ''
       GROUP BY category
       ORDER BY category`,
    );

    res.json({
      success: true,
      categories: result.rows.map((row, index) => ({
        id: index + 1,
        name: row.name,
        description: `Catégorie ${row.name}`,
        product_count: parseInt(row.product_count),
      })),
    });
  } catch (error) {
    console.error("❌ Error retrieving categories:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Add a new category (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // For now, categories are just strings in the marketplace table
    // In production, you might want a separate categories table
    res.json({
      success: true,
      message: "Category added successfully",
      category: { id: Date.now(), name, description, product_count: 0 },
    });
  } catch (error) {
    console.error("❌ Error adding category:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Update a category (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // For now, categories are just strings in the marketplace table
    // In production, you might want a separate categories table
    res.json({
      success: true,
      message: "Category updated successfully",
      category: { id: categoryId, name, description },
    });
  } catch (error) {
    console.error("❌ Error updating category:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Delete a category (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // For now, categories are just strings in the marketplace table
    // In production, you might want a separate categories table
    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Get marketplace analytics (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Get total revenue
    const revenueResult = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE status IN ('confirmed', 'paid')`,
    );

    // Get total orders
    const ordersResult = await pool.query(
      `SELECT COUNT(*) as total_orders FROM orders WHERE status IN ('confirmed', 'paid')`,
    );

    // Get total products
    const productsResult = await pool.query(
      `SELECT COUNT(*) as total_products FROM marketplace WHERE status = 'approved'`,
    );

    // Get total customers
    const customersResult = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as total_customers FROM orders WHERE status IN ('confirmed', 'paid')`,
    );

    // Get top products
    const topProductsResult = await pool.query(
      `SELECT p.name, COUNT(o.id) as sales, SUM(o.total_amount) as revenue
       FROM marketplace p
       LEFT JOIN orders o ON p.id = o.product_id AND o.status IN ('confirmed', 'paid')
       WHERE p.status = 'approved'
       GROUP BY p.id, p.name
       ORDER BY sales DESC
       LIMIT 5`,
    );

    // Get recent orders
    const recentOrdersResult = await pool.query(
      `SELECT o.id, u.nom as customer, o.total_amount, o.status, o.created_at::date as date
       FROM orders o
       JOIN utilisateur u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 5`,
    );

    const analytics = {
      totalRevenue: parseFloat(revenueResult.rows[0].total_revenue),
      totalOrders: parseInt(ordersResult.rows[0].total_orders),
      totalProducts: parseInt(productsResult.rows[0].total_products),
      totalCustomers: parseInt(customersResult.rows[0].total_customers),
      revenueChange: 12.5, // Mock data - would calculate from previous period
      ordersChange: 8.3,
      productsChange: -2.1,
      customersChange: 15.7,
      topProducts: topProductsResult.rows.map(row => ({
        name: row.name,
        sales: parseInt(row.sales),
        revenue: parseFloat(row.revenue || 0),
      })),
      recentOrders: recentOrdersResult.rows.map(row => ({
        id: `#${row.id}`,
        customer: row.customer,
        amount: parseFloat(row.total_amount),
        status: row.status,
        date: row.date.toISOString().split('T')[0],
      })),
      monthlyRevenue: [], // Would implement monthly aggregation
    };

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("❌ Error retrieving analytics:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Update order status (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, tracking_number } = req.body;
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    updateFields.push(`status = $${paramCount++}`);
    updateValues.push(status);

    if (tracking_number) {
      updateFields.push(`tracking_number = $${paramCount++}`);
      updateValues.push(tracking_number);
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(orderId);

    const result = await pool.query(
      `UPDATE orders
       SET ${updateFields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      updateValues,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Create a dispute for an order (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createDispute = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { reason, description } = req.body;
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // Check if order exists
    const orderCheck = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [orderId],
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // For now, we'll store disputes in a simple table or JSON field
    // In production, you might want a dedicated disputes table
    const result = await pool.query(
      `INSERT INTO order_disputes (order_id, reason, description, status, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [orderId, reason, description, 'open', userId],
    );

    res.status(201).json({
      success: true,
      message: "Dispute created successfully",
      dispute: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error creating dispute:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Get all disputes (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDisputes = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // For now, return mock data since we don't have the disputes table
    // In production, this would query the order_disputes table
    const mockDisputes = [
      {
        id: 1,
        order_id: 123,
        customer_name: "Marie Dubois",
        reason: "Produit endommagé",
        description: "Le livre reçu était en mauvais état",
        status: "open",
        created_at: "2024-01-15T10:00:00Z"
      }
    ];

    res.json({
      success: true,
      disputes: mockDisputes,
    });
  } catch (error) {
    console.error("❌ Error retrieving disputes:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Resolve a dispute (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const resolveDispute = async (req, res) => {
  try {
    const disputeId = req.params.id;
    const { resolution, notes } = req.body;
    const userId = req.user.id;

    const userCheck = await pool.query(
      "SELECT role FROM utilisateur WHERE id = $1",
      [userId],
    );

    if (userCheck.rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access restricted to administrators",
      });
    }

    // For now, mock the resolution since we don't have the disputes table
    // In production, this would update the order_disputes table
    res.json({
      success: true,
      message: "Dispute resolved successfully",
      dispute: {
        id: disputeId,
        status: 'resolved',
        resolution,
        resolution_notes: notes
      },
    });
  } catch (error) {
    console.error("❌ Error resolving dispute:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

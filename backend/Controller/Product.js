const Products = require('../Models/Product');

// CREATE a new product
const createProducts = async (req, res) => {
  try {
    const { ProductName, Category, Brand, ProductType } = req.body;

    if (!ProductName || !Category || !Brand || !ProductType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Generate a product code like PRD001
    let latestProduct = await Products.findOne().sort({ productCode: -1 });

    let newCode = 'PRD001'; // default
    if (latestProduct && latestProduct.productCode) {
      const lastCodeNum = parseInt(latestProduct.productCode.replace('PRD', ''));
      const nextCodeNum = lastCodeNum + 1;
      newCode = 'PRD' + String(nextCodeNum).padStart(3, '0');
    }

    const newProduct = new Products({
      ProductName,
      Category,
      Brand,
      ProductType,
      productCode: newCode,
    });

    await newProduct.save();

    res.status(200).json({ message: 'Product successfully created', product: newProduct });
  } catch (err) {
    console.error("Error in createProducts:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET all products with optional filters
const getproductrs = async (req, res) => {
  try {
    const { ProductName, Category, Brand, ProductType } = req.query;
    const filter = {};

    if (ProductName?.trim()) filter.ProductName = ProductName.trim();
    if (Category?.trim()) filter.Category = Category.trim();
    if (Brand?.trim()) filter.Brand = Brand.trim();
    if (ProductType?.trim()) filter.ProductType = ProductType.trim(); // ✅ fixed

    const filteredData = await Products.find(filter);

    console.log("Filters used:", filter);
    console.log("Data fetched successfully:", filteredData);

    // ✅ Return array directly
    res.status(200).json(filteredData);
  } catch (err) {
    console.error("Fetching error:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.createProducts=createProducts
exports.getproductrs=getproductrs
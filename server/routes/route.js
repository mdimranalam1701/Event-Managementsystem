const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const checkRole = require('../middleware/roleMiddleware.js');
const { upload } = require('../middleware/multerMiddleware.js');
const { getAllUsers, updateMembership } = require('../controllers/adminController.js');

const {
    customerRegister,
    customerLogIn
} = require('../controllers/userController.js');
const {
    getVendorsByCategory,
    getVendorProducts,
    placeOrder,
    getUserOrders,
    addGuest,
    getGuests,
    updateGuest,
    deleteGuest
} = require('../controllers/userActionController.js'); 

const { 
    addItem, getVendorItems, updateItem, deleteItem, 
    getVendorTransactions, updateOrderStatus 
} = require('../controllers/vendorController.js');

//          AUTH ROUTES (Sabke liye)

router.post('/userRegister', customerRegister);
router.post('/userLogin', customerLogIn);



//          USER (CUSTOMER) ROUTES


router.get('/user/vendors/:category', authMiddleware, getVendorsByCategory);
router.get('/user/products/:vendorId', authMiddleware, getVendorProducts);
router.post('/user/order', authMiddleware, placeOrder);
router.get('/user/orders/:userId', authMiddleware, getUserOrders);
router.post('/user/guest', authMiddleware, addGuest);
router.get('/user/guests/:userId', authMiddleware, getGuests);  
router.put('/user/guest/:guestId', authMiddleware, updateGuest);
router.delete('/user/guest/:guestId', authMiddleware, deleteGuest);



//          VENDOR ROUTES (Super Secure)


// Ab bina Vendor account ke koi in APIs ko chhu bhi nahi sakta!
router.post('/vendor/item', authMiddleware, checkRole('Vendor'), upload.single('image'), addItem);
router.get('/vendor/items/:vendorId', authMiddleware, checkRole('Vendor'), getVendorItems);
router.put('/vendor/item/:itemId', authMiddleware, checkRole('Vendor'), updateItem);
router.delete('/vendor/item/:itemId', authMiddleware, checkRole('Vendor'), deleteItem);

router.get('/vendor/orders/:vendorId', authMiddleware, checkRole('Vendor'), getVendorTransactions);
router.put('/vendor/order/:orderId/status', authMiddleware, checkRole('Vendor'), updateOrderStatus);

module.exports = router;


//          ADMIN ROUTES (Super Secure )


// Maintenance Menu ke liye saare users lana
router.get('/admin/users', authMiddleware, checkRole('Admin'), getAllUsers);

// Vendor ki membership update karna
router.put('/admin/membership/:vendorId', authMiddleware, checkRole('Admin'), updateMembership);

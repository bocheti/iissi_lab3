import OrderController from '../controllers/OrderController.js'
import ProductController from '../controllers/ProductController.js'
import RestaurantController from '../controllers/RestaurantController.js'
import { isLoggedIn, hasRole } from '../middlewares/AuthMiddleware.js'
import RestaurantValidation from '../controllers/validation/RestaurantValidation.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import RestaurantMiddleware from '../middlewares/RestaurantMiddleware.js'
import { handleFilesUpload } from '../middlewares/FileHandlerMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { Restaurant } from '../models/models.js'

const loadFileRoutes = function (app) {
  app.route('/restaurants')
    .get(RestaurantController.index)
    .post(isLoggedIn,
      hasRole('owner'),
      handleFilesUpload(['image'], process.env.RESTAURANTS_FOLDER),
      RestaurantValidation.create,
      handleValidation,
      RestaurantController.create)

  app.route('/restaurants/:restaurantId')
    .get(checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantController.show)
    .put(isLoggedIn,
      hasRole('owner'),
      handleFilesUpload(['image'], process.env.RESTAURANTS_FOLDER),
      RestaurantValidation.create,
      handleValidation,
      RestaurantMiddleware.checkRestaurantOwnership,
      RestaurantController.update)
    .delete(isLoggedIn,
      hasRole('owner'),
      RestaurantMiddleware.restaurantHasNoOrders,
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      RestaurantController.destroy)

  app.route('/restaurants/:restaurantId/orders')
    .get(isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      OrderController.indexRestaurant)

  app.route('/restaurants/:restaurantId/products')
    .get(checkEntityExists(Restaurant, 'restaurantId'),
      ProductController.indexRestaurant)

  app.route('/restaurants/:restaurantId/analytics')
    .get(isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      OrderController.analytics)
}
export default loadFileRoutes

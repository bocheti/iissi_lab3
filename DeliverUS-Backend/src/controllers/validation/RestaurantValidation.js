import { check } from 'express-validator'
import { checkFileIsImage, checkFileMaxSize } from './FileValidationHelper.js'
import { RestaurantCategory } from '../../models/models.js'

const maxFileSize = 2000000 // around 2Mb

const checkCategoryExists = async (value, { req }) => {
  try {
    const cat = await RestaurantCategory.findByPk(req.body.restaurantCategoryId)
    if (cat === null) {
      return Promise.reject(new Error('The restaurantCategoryId does not exist.'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const create = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
  check('heroImage').custom((value, { req }) => {
    return checkFileIsImage(req, 'heroImage')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('heroImage').custom((value, { req }) => {
    return checkFileMaxSize(req, 'heroImage', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('logo').custom((value, { req }) => {
    return checkFileIsImage(req, 'logo')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('logo').custom((value, { req }) => {
    return checkFileMaxSize(req, 'logo', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  // TODO: Complete validations
  check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('postalCode').exists().isString().isLength({ min: 1, max: 255 }).trim().isPostalCode('any'),
  check('url').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim().isURL(),
  check('email').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim().isEmail(),
  check('phone').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim().isMobilePhone('any'),
  check('restaurantCategoryId').exists().isInt({ gt: 0 }).toInt(),
  check('restaurantCategoryId').custom(checkCategoryExists),
  check('userId').not().exists()
]
const update = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
  check('heroImage').custom((value, { req }) => {
    return checkFileIsImage(req, 'heroImage')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('heroImage').custom((value, { req }) => {
    return checkFileMaxSize(req, 'heroImage', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('logo').custom((value, { req }) => {
    return checkFileIsImage(req, 'logo')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('logo').custom((value, { req }) => {
    return checkFileMaxSize(req, 'logo', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  // TODO: Complete validations
  check('address').exists().isString().trim().isLength({ min: 1, max: 255 }),
  check('postalCode').exists().isString().trim().isPostalCode('any'),
  check('url').optional({ nullable: true, checkFalsy: true }).isString().trim().isURL(),
  check('email').optional({ nullable: true, checkFalsy: true }).isString().trim().isEmail(),
  check('phone').optional({ nullable: true, checkFalsy: true }).isString().isMobilePhone('any'),
  check('restaurantCategoryId').not().exists(),
  check('userId').not().exists()
]

export default { create, update }

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The user ID
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email
 *         fullname:
 *           type: string
 *           description: The user's full name
 *         avatar:
 *           type: string
 *           description: URL of the user's avatar
 *         isActive:
 *           type: boolean
 *           description: User account status
 *         bio:
 *           type: string
 *           description: User's biography
 *         link:
 *           type: string
 *           description: User's website or social media link
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the user was last updated
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *         - fullname
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *           example: john_doe
 *         password:
 *           type: string
 *           description: The user's password
 *           example: password123
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *           example: john.doe@example.com
 *         fullname:
 *           type: string
 *           description: The user's full name
 *           example: John Doe
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         fullname:
 *           type: string
 *           description: The user's full name
 *           example: John Doe
 *         avatar:
 *           type: string
 *           description: URL of the user's avatar
 *           example: https://example.com/avatar.jpg
 *         bio:
 *           type: string
 *           description: User's biography
 *           example: Software developer
 *         link:
 *           type: string
 *           description: User's website or social media link
 *           example: https://github.com/johndoe
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Profile updated successfully
 *         data:
 *           $ref: '#/components/schemas/User'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with username, password, email and fullname
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             username: john_doe
 *             password: password123
 *             email: john.doe@example.com
 *             fullname: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: User registered successfully
 *               data:
 *                 id: 507f1f77bcf86cd799439011
 *                 username: john_doe
 *                 createdAt: 2024-04-05T10:00:00.000Z
 *       400:
 *         description: Invalid input or username/email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Username or email already exists
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the authenticated user's profile information. Requires a Bearer access token in the Authorization header.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 507f1f77bcf86cd799439011
 *                 username: john_doe
 *                 email: john.doe@example.com
 *                 fullname: John Doe
 *                 createdAt: 2024-04-05T10:00:00.000Z
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: User not found
 */

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update user profile
 *     description: Update the authenticated user's profile information. Can update fullname, bio, link, and upload a new avatar image.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The user's avatar image file
 *               fullname:
 *                 type: string
 *                 description: The user's full name
 *               bio:
 *                 type: string
 *                 description: User's biography
 *               link:
 *                 type: string
 *                 description: User's website or social media link
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: Profile updated successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 username: john_doe
 *                 email: john.doe@example.com
 *                 fullname: John Doe
 *                 avatar: https://example.com/avatar.jpg
 *                 isActive: true
 *                 bio: Software developer
 *                 link: https://github.com/johndoe
 *                 createdAt: 2024-04-05T10:00:00.000Z
 *                 updatedAt: 2024-04-05T10:00:00.000Z
 *       400:
 *         description: Invalid input or upload failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Failed to upload image to S3
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: User not found
 */

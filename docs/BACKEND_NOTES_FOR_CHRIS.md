# Backend notes from the frontend integration (Vaancha)

The frontend now calls the real API. These are the things I found in `server/` while connecting it.
Items 1 to 3 matter most. The frontend works today with workarounds, marked `TEMPORARY` in `client/src/api/services.js`.

## 1. SECURITY: database password is committed (do today)
`server/server.js` has a hard-coded `MONGO_URI` fallback with the Atlas username and password. It is in the GitHub history.
- Rotate the `fridgerescue_team` password in MongoDB Atlas now.
- Delete the fallback string. Read only `process.env.MONGO_URI` and fail with a clear error if it is missing.
- Keep the real value only in `server/.env` (already git-ignored). Add a `server/.env.example` with `MONGO_URI=`, `JWT_SECRET=`, `JWT_EXPIRES_IN=1h`, `PORT=5000`.

## 2. Food item routes are not protected and not per-user
`routes/fooditemRoutes.js` has no `protect` middleware, `getAll` returns every user's items, and `create` requires `userId` in the request body (anyone can write to anyone's fridge).
Suggested fix:
```js
// routes/fooditemRoutes.js
import protect from '../middleware/authMiddleware.js';
router.use(protect);

// controllers/foodItemController.js
export const getAll = async (req, res) => {
  res.json(await FoodItem.find({ userId: req.user._id }).populate(populate));
};
export const create = async (req, res) => {
  const item = await FoodItem.create({ ...req.body, userId: req.user._id });   // ignore any userId from the client
  res.status(201).json(await item.populate(populate));
};
// getById / update / remove: use findOne / findOneAndUpdate / findOneAndDelete with { _id: req.params.id, userId: req.user._id }
```
Frontend impact: it already sends `Authorization: Bearer <token>`. After this change, delete the two `TEMPORARY` bits in `client/src/api/services.js` (the client-side `userId` filter in `foodApi.list` and `body.userId` in `toBody`).

## 3. Add the optional `shelf` field (Lorena asked)
`models/FoodItem.js` has no `shelf`, so Mongoose silently drops it and the shelf never saves.
```js
shelf: { type: Number, min: 1, default: null },
```
The frontend already sends `shelf` (a whole number) only when the user picks one, and shows it on the card and in the edit form.

## 4. Dangerous routes
`DELETE /api/fooditems` and `DELETE /api/categories` (`removeAll`) wipe the whole collection for everyone, with no auth. Remove them or restrict them before the demo.

## 5. Categories and units (agreed with Lorena)
- Fixed lists for this release, defaults have `userId: null`. Frontend shows defaults + the user's own (none yet).
- Seed units: `pcs, g, kg, mL, L, packs`.
- Seed categories with **Fruits** and **Vegetables** as separate entries (not "Produce"), plus Dairy, Meat, etc.
- Block deleting a category/unit that food items still use:
```js
// categoryController.remove
if (await FoodItem.exists({ category: req.params.id })) {
  return res.status(409).json({ message: 'This category is still used by food items.' });
}
```
(same for units with `{ unit: req.params.id }`).

## 6. Contract the frontend uses (please confirm)
- `POST /api/auth/register`, `POST /api/auth/login` -> `{ message, token, user: { id, name, email } }`. Matches what you built.
- `GET /api/categories`, `GET /api/units` -> arrays of `{ _id, name, userId }`.
- `GET/POST /api/fooditems`, `GET/PUT/DELETE /api/fooditems/:id`. Body: `{ name, category: <id>, quantity, unit: <id>, expirationDate: 'YYYY-MM-DD', shelf? }`. Responses populate `category` and `unit` as `{ _id, name }` (as your controller does now).
- The Jira ticket says `/api/food`; the code uses `/api/fooditems` (what `server.js` mounts).
- Tokens expire after 1 hour (`JWT_EXPIRES_IN` default). On a 401 from a protected route the frontend logs the user out and sends them to /login.

## 7. Nice to have
- `server/app.js` (CommonJS, health route) is not used by `server.js`; `express.js` is. Consider deleting one.
- Add `cors` only if the client is ever served from a different origin than the API (not needed in dev, Vite proxies `/api`).

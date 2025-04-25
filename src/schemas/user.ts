import { z } from "zod";

export const userSchema = z.interface({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ====================================
// Create a type infering from schema
type User = z.infer<typeof userSchema>;

const user1: User = {
  id: "123",
  name: "John Doe",
  email: "johndoe@gmail.com",
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log(user1);

// ====================================
// Coercion forces a type into a value
const coercionSchema = z.coerce.string();
coercionSchema.parse(123); // "123"
coercionSchema.parse(true); // "true"
coercionSchema.parse(null); // "null"
coercionSchema.parse(undefined); // "undefined"
// boolean coercion transforms truthy and falsy values into true and false
const coercionBooleanSchema = z.coerce.boolean();
coercionBooleanSchema.parse(1); // true
coercionBooleanSchema.parse("true"); // true
coercionBooleanSchema.parse("false"); // true
coercionBooleanSchema.parse(0); // false
coercionBooleanSchema.parse(undefined); // false
coercionBooleanSchema.parse(""); // false

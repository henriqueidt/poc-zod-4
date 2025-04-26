import { stringbool, z } from "zod";

export const userSchema = z.interface({
  id: z.uuid({ version: "v4" }),
  name: z.string().min(1).max(50),
  email: z.email(),
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

// Literals represents a specific value
const john = z.literal("John");
const ten = z.literal(10);

// Strings
const minMaxStringSchema = z.string().min(1).max(10);
// String transformations
const stringTransformationsSchema = z.string().trim().toLowerCase();

// Email
const emailSchema = z.email();
// Email custom pattern
const emailCustomSchema = z.email({
  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
});
// Email with zod patterns
const emailZodPatternSchema = z.email({ pattern: z.regexes.html5Email });

// UUID
const uuidSchema = z.uuid({ version: "v4" });
const uuidSchemaSimple = z.uuidv4();

// ISO datetime (allows "2020-01-01T00:00:00Z")
const isoDateSchema = z.iso.datetime();
// with timezone offset (allows "2020-01-01T00:00:00+02:00")
const isoDateWithTimezoneSchema = z.iso.datetime({ offset: true });
// timezoneless (allows "2020-01-01T00:00:00")
const isoDateWithoutTimezoneSchema = z.iso.datetime({ local: true });
// ISO date (allows "2020-01-01")
const isoDateSchemaSimple = z.iso.date();

// ISO time (allows "00:00:00")
const isoTimeSchema = z.iso.time();

// NUMBERS
const numberSchema = z.number();
// with min and max
const numberMinMaxSchema = z.number().min(1).max(10);

// ENUMS
const animalEnum = z.enum(["dog", "cat", "fish"]);
// can use ts enums
enum AnimalEnum {
  Dog = "dog",
  Cat = "cat",
  Fish = "fish",
}
const animalEnumTs = z.enum(AnimalEnum);
// create new enum excluding values
const waterAnimalEnum = animalEnum.exclude(["dog", "cat"]);
// create new enum including values
const landAnimalEnum = animalEnum.extract(["dog", "cat"]);

// Parsing ENV variables (good to parse boolean values for example)
const strbool = z.stringbool();
strbool.parse("true"); // true
strbool.parse("false"); // false
strbool.parse("1"); // true
strbool.parse("0"); // false
strbool.parse("y"); // true
strbool.parse("n"); // false
// can customize the truthy and falsy values
const strboolCustom = z.stringbool({
  truthy: ["yes", "true", "1"],
  falsy: ["no", "false", "0"],
});

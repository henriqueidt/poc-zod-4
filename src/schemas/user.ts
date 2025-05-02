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

// Optional values
const optionalSchema = z.string().optional();

// Nullable values
const nullableSchema = z.string().nullable();

// Nullish values (optional or nullable)
const nullishSchema = z.string().nullish();

// Template literals
// `hello, ${string}`
const helloTemplateLiteral = z.templateLiteral(["hello, ", z.string()]);
const cssUnits = z.enum(["px", "em", "rem", "%"]);
// `10px` | `1.5em` | `2rem` | `50%`
const cssValue = z.templateLiteral([z.number(), cssUnits]);
const emailValue = z.templateLiteral([
  z.string().min(5),
  "@",
  z.string().min(10),
]);

// Object vs interface
// Object - value can be set undefined or omitted
z.object({ name: z.string().optional() }); // { name?: string | undefined }
// Interface - For optional value to be able to get ommited, needs to add `?`
z.interface({ "name?": z.string() }); // { name?: string | undefined }
z.interface({ name: z.string() }); // { name: string | undefined }

// Unrecognized keys are removed from parsed result
const UserInterface = z.interface({
  id: z.string(),
  name: z.string(),
});
UserInterface.parse({ id: "123", name: "John Doe", age: 30 }); // { id: '123', name: 'John Doe' }

// Strict schemas throw an error if unrecognized keys are present
const UserStrictInterface = z.strictInterface({
  id: z.string(),
  name: z.string(),
});
UserStrictInterface.parse({ id: "123", name: "John Doe", age: 30 }); // throws error

// Loose schmeas allow unrecognized keys
const UserLooseInterface = z.looseInterface({
  id: z.string(),
});
UserLooseInterface.parse({ id: "123", name: "John Doe", age: 30 }); // { id: '123', name: 'John Doe', age: 30 }

const idSchema = UserInterface.def.shape.id; // access to the internal schema
const keySchema = UserInterface.keyof(); // creates an enum shcema for the keys

// EXTENDS
const UserWithAge = UserInterface.extend({ age: z.number() }); // extends the schema with a new key
// extend can be used to overwrite existing keys too
const UserOverwrittenName = UserInterface.extend({
  name: z.string().min(5),
}); // extends the schema with a new key
// another schema can be passed to extend a schema
// if both have the same key, the last one will be used
const WithAddress = z.interface({ address: z.string() });
const UserWithAddress = UserInterface.extend(WithAddress);

// PICK - creates a new schema with only specific keys
const UserNameOnly = UserInterface.pick({ name: true }); // { name: string }
// OMIT - creates a new schema, removing specific keys
const UserWithoutName = UserInterface.omit({ name: true }); // { id: string }

// PARTIAL - Makes keys optional
const UserPartial = UserInterface.partial(); // { id?: string, name?: string }
// can also make only some fields optional
const UserPartialName = UserInterface.partial({ name: true }); // { id: string, name?: string }

// REQUIRED - Makes keys required
const UserRequired = UserPartial.required(); // { id: string, name: string }
// can also make only some fields required
const UserRequiredName = UserPartial.required({ name: true }); // { id?: string, name: string }

// RECURSIVE TYPES USING GETTERS
const RecursiveUserSchema = z.interface({
  id: z.string(),
  name: z.string(),
  get friends() {
    return z.array(RecursiveUserSchema);
  },
});
type RecursiveUser = z.infer<typeof RecursiveUserSchema>; // { id: string, name: string, friends: RecursiveUser[] }
// mutually recursion is also possible
const RecursiveUserSchema2 = z.interface({
  id: z.string(),
  name: z.string(),
  get accounts() {
    return z.array(RecursiveAccountSchema);
  },
});
const RecursiveAccountSchema = z.interface({
  id: z.string(),
  get user() {
    return RecursiveUserSchema2;
  },
});

// ARRAY SCHEMAS
const stringArraySchema = z.array(z.string()); // string[]
// min, max
const stringArrayMinMaxSchema = z.array(z.string()).min(1).max(10);
// exact length
const stringArrayExactLengthSchema = z.array(z.string()).length(3);

// TUPLE SCHEMAS - fixed length arrays with specific types for each index
const tupleSchema = z.tuple([z.string(), z.number()]); // [string, number]
// can have a variadic rest argument
const tupleSchemaWithRest = z.tuple([z.string()], z.number()); // [string, ...number[]]

// Unions - represents logical OR
const stringOrNumberSchema = z.union([z.string(), z.number()]); // string | number

// Discriminated unions - logical OR with common key
const Result = z.discriminatedUnion([
  z.interface({ status: z.literal("success"), data: z.string() }),
  z.interface({ status: z.literal("failed"), error: z.string() }),
]);
function handleResult(result: z.infer<typeof Result>) {
  if (result.status === "success") {
    console.log(result.data);
  } else {
    console.log(result.error);
  }
}

// Intersection - represents logical AND
const Person = z.interface({ name: z.string() });
const Employee = z.interface({ id: z.string() });
const EmployeePerson = z.intersection(Person, Employee); // { name: string, id: string }

// Records - used to validate record types like Record<string, number>
const keys = z.enum(["id", "name"]);
// zod will validate that all keys are present
const User2 = z.record(keys, z.string()); // { id: string, name: string }
// to not validate all keys, we need to use partialRecord
const UserWithPartial = z.partialRecord(keys, z.string()); // { id?: string, name?: string }

// Maps
const mapSchema = z.map(z.string(), z.number()); // Map<string, number>
type MapType = z.infer<typeof mapSchema>;
const map: MapType = new Map();
map.set("key", 1);
mapSchema.parse(map);

// Sets
const setSchema = z.set(z.string()).min(5).max(10); // Set<string>
type setType = z.infer<typeof setSchema>;
const set: setType = new Set();
set.add("a");
setSchema.parse(set);

// InstanceOf - can be used to validate an input is an instance of a class
class UserClass {
  name!: string;
}
const userSchema1 = z.instanceof(UserClass);
userSchema1.parse(new UserClass());

// Refinements - use custom validations
const refinedString = z.string().refine((val) => val.length < 100);
// can customize the error message
const refinedCustomError = z.string().refine((val) => val.length < 100, {
  error: "invalid message",
});
// by default zod will go through every refinement
const multipleRefinementsString = z
  .string()
  .refine((val) => val.length > 8)
  .refine((val) => val === val.toLowerCase());
/* [
  { "code": "custom", "message": "Too short!" },
  { "code": "custom", "message": "Must be lowercase" }
] */
// use the abort parameter to mark a refinement as a stoppable
const refinementsWithAbort = z
  .string()
  .refine((val) => val.length > 8, { abort: true })
  .refine((val) => val === val.toLowerCase());
// [{ code: "custom", message: "Too short!" }];

// refinements can also be async
const userId = z.string().refine(async (id) => {
  // verify that ID exists in database
  return true;
});
// notice it is needed to use parseAsync to parse with async refinements
const result = await userId.parseAsync("1234");

// CHECK - is a more verbose version of refine
const UniqueStringArray = z.array(z.string()).check((ctx) => {
  if (ctx.value.length > 3) {
    ctx.issues.push({
      code: "too_big",
      maximum: 3,
      origin: "array",
      inclusive: true,
      message: "Too many items",
      input: ctx.value,
    });
  }

  if (ctx.value.length !== new Set(ctx.value).size) {
    ctx.issues.push({
      code: "custom",
      message: `No duplicates allowed.`,
      input: ctx.value,
      continue: true, // make this issue continuable (default: false)
    });
  }
});

// PIPES - allow to chain multiple schemas
const stringLength = z.string().pipe(z.transform((val) => val.length));
stringLength.parse("abcde"); // 5

// TRANSFORMS - It transforms data, instead of validating
const transformToString = z.transform((val) => String(val));
transformToString.parse(123); // "123"
transformToString.parse(true); // "true"
// validation can be done inside transforms using ctx
const coercedInt = z.transform((val, ctx) => {
  try {
    const parsed = Number.parseInt(String(val));
    return parsed;
  } catch (e) {
    ctx.issues.push({
      code: "custom",
      message: "Not a number",
      input: val,
    });

    // this is a special constant with type `never`
    // returning it lets you exit the transform without impacting the inferred return type
    return z.NEVER;
  }
});
// trasnforms can be used with pipe, to first validate and then transform data
const strToLength = z.string().pipe(z.transform((val) => val.length));
// can be abstracted with just transform function
const transformStrToLength = z.string().transform((val) => val.length);
// transform can also be async (need to use parseAsync to parse data then)
const idToUser = z.string().transform(async (id) => {
  // fetch user from database
  // return db.getUserById(id);
});
const user = await idToUser.parseAsync("abc123");

// DEFAULTS - set a default value to a schema
const defaultAnimalSchema = z.string().default("dog");
defaultAnimalSchema.parse(undefined); // "dog"
// if a function is passed, it will be reexecuted on every validation
const randomNumberSchema = z.number().default(Math.random);

// CATCH - very similar to default, can be used to return a value in case of validation error
const numberSchemaWithCatch = z.number().catch(5);
numberSchemaWithCatch.parse("dog"); // 5
// if a function is passed, it will execute on every validation
const numberWithRandomCatch = z.number().catch((ctx) => {
  console.log(ctx.issues); // the caught ZodError
  return Math.random();
});

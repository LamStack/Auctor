import { TrackDefinition } from "@/lib/stationTypes";

export const databaseISTrack: TrackDefinition = {
  slug: "database-information-systems",
  title: "Database & Information Systems",
  description:
    "A real SQL sandbox seeded with a small e-commerce database and hands-on data tasks.",
  theme: "qa-lab",
  category: "database",
  stations: [
    {
      order: 1,
      type: "mcq",
      title: "Data Fundamentals Checkpoint",
      config: {
        intro: "A few core database concepts before you get hands-on.",
        questions: [
          {
            id: "q1",
            prompt: "What does a PRIMARY KEY guarantee for a column?",
            options: [
              { id: "a", text: "It can contain duplicate values" },
              { id: "b", text: "Each value uniquely identifies a row and cannot be null" },
              { id: "c", text: "It must be a text field" },
              { id: "d", text: "It automatically encrypts the data" },
            ],
            correctOptionId: "b",
            explanation: "Primary keys uniquely and non-nullably identify each row.",
          },
          {
            id: "q2",
            prompt: "A JOIN between two tables is primarily used to:",
            options: [
              { id: "a", text: "Delete rows from both tables" },
              { id: "b", text: "Combine related rows from multiple tables based on a common column" },
              { id: "c", text: "Create a backup of a table" },
              { id: "d", text: "Change a column's data type" },
            ],
            correctOptionId: "b",
            explanation: "JOINs combine rows across tables using a related column.",
          },
          {
            id: "q3",
            prompt: "What is database normalization primarily meant to reduce?",
            options: [
              { id: "a", text: "Query speed" },
              { id: "b", text: "Data redundancy and inconsistency" },
              { id: "c", text: "The number of tables" },
              { id: "d", text: "The number of users" },
            ],
            correctOptionId: "b",
            explanation: "Normalization organizes data to minimize redundancy and anomalies.",
          },
          {
            id: "q4",
            prompt: "Which SQL clause filters rows before any grouping happens?",
            options: [
              { id: "a", text: "HAVING" },
              { id: "b", text: "WHERE" },
              { id: "c", text: "ORDER BY" },
              { id: "d", text: "GROUP BY" },
            ],
            correctOptionId: "b",
            explanation: "WHERE filters rows before grouping; HAVING filters after grouping.",
          },
        ],
      },
    },
    {
      order: 2,
      type: "sql-sandbox",
      title: "Live Database Console",
      config: {
        intro:
          "This is a small e-commerce database with customers and their orders. Run any queries you like to explore it, then complete the tasks below.",
        schemaSql: `
          CREATE TABLE customers (
            id INTEGER PRIMARY KEY,
            name TEXT,
            city TEXT,
            signup_date TEXT
          );
          CREATE TABLE orders (
            id INTEGER PRIMARY KEY,
            customer_id INTEGER,
            amount REAL,
            status TEXT,
            order_date TEXT
          );
          INSERT INTO customers VALUES (1,'Ahmed Ali','Manama','2024-01-15');
          INSERT INTO customers VALUES (2,'Fatima Khan','Riffa','2024-02-20');
          INSERT INTO customers VALUES (3,'Yousef Nasser','Muharraq','2024-03-05');
          INSERT INTO orders VALUES (1,1,45.50,'completed','2024-04-01');
          INSERT INTO orders VALUES (2,1,120.00,'completed','2024-04-10');
          INSERT INTO orders VALUES (3,2,30.00,'pending','2024-04-12');
          INSERT INTO orders VALUES (4,3,75.25,'cancelled','2024-04-15');
          INSERT INTO orders VALUES (5,2,200.00,'completed','2024-04-20');
        `,
        schemaSummary: [
          { table: "customers", columns: ["id", "name", "city", "signup_date"] },
          { table: "orders", columns: ["id", "customer_id", "amount", "status", "order_date"] },
        ],
        tasks: [
          {
            id: "t1",
            prompt:
              "A new customer, Layla Hassan from Isa Town, just signed up (id 4, date '2024-05-01'). Insert her into customers.",
            validationSql: "SELECT * FROM customers WHERE id = 4 AND name = 'Layla Hassan' AND city = 'Isa Town';",
            hint: "INSERT INTO customers VALUES (4, 'Layla Hassan', 'Isa Town', '2024-05-01');",
          },
          {
            id: "t2",
            prompt: "Order id 3 was just cancelled by the customer. Update its status to 'cancelled'.",
            validationSql: "SELECT * FROM orders WHERE id = 3 AND status = 'cancelled';",
            hint: "UPDATE orders SET status = 'cancelled' WHERE id = 3;",
          },
          {
            id: "t3",
            prompt: "Order id 4 was a test order and should be removed entirely from the orders table.",
            validationSql: "SELECT * FROM orders WHERE id = 4;",
            expectAbsence: true,
            hint: "DELETE FROM orders WHERE id = 4;",
          },
          {
            id: "t4",
            prompt: "Add a new column called loyalty_points (integer) to the customers table.",
            validationSql: "SELECT loyalty_points FROM customers LIMIT 1;",
            hint: "ALTER TABLE customers ADD COLUMN loyalty_points INTEGER;",
          },
        ],
      },
    },
    {
      order: 3,
      type: "bug-hunt",
      title: "Suspicious Query Log",
      config: {
        instruction: "A query log from a bug report is scrolling by. Click the line that describes a real defect.",
        sourceLabel: "orders-report.log",
        lines: [
          { id: "l1", text: "Report correctly totals completed orders per customer" },
          { id: "l2", text: "Report includes cancelled orders in the revenue total" },
          { id: "l3", text: "Report excludes pending orders from the revenue total" },
          { id: "l4", text: "Report sorts customers alphabetically by name" },
        ],
        buggyLineId: "l2",
        explanation: "Cancelled orders shouldn't count toward revenue — including them inflates the total incorrectly.",
      },
    },
  ],
};

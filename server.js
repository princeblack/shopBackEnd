require("dotenv").config(); // Charge les variables d'environnement
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const fileUploadRouter = require("./routes/fileUploadRoutes");
const logger = require("./utils/logger");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const morgan = require("morgan");
const connectDB = require("./config/db");

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Initialize CSRF protection
const csrfProtection = csrf({ cookie: true });

const corsOptions = {
  origin: ["https://yourapp.com", "https://another-trusted-domain.com"], // Replace with your trusted domains
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

const app = express();
const PORT = process.env.PORT || 5000;
app.disable("x-powered-by");

// Routes
const userRoutes = require("./routes/userRoutes");

// Middleware
app.use(cors());
app.disable('x-powered-by');
// Configure Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://trusted-cdn.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://trusted-cdn.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.yourapp.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(morgan("combined")); // HTTP request logging
app.use(limiter);
app.use(xss());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(xssClean());
app.use(hpp());
// Set cookies securely
app.use((req, res, next) => {
  res.cookie("session", req.sessionID, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS
    sameSite: "strict", // Prevent CSRF
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  next();
});

// Parse JSON
app.use(express.json({ limit: "10kb" })); // Limit JSON payload to 10KB
// Database connection (MongoDB)
connectDB();

/** STATIC FILES */
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
app.use("/api/upload", fileUploadRouter);

/** ROUTES Api endpoint*/
app.use("/api", csrfProtection);
app.use("/api/users", userRoutes);
app.use('/api/files', fileUploadRouter);

// Route de test
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Error handling middleware (for 404, 500, etc.)
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

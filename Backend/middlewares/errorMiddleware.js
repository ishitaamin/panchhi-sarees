export const notFound = (req, res, next) => {
  res.status(404).json({ message: "Not Found" });
};

export const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

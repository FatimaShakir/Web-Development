import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    propertyInterest: {
      type: String,
      required: [true, "Property interest is required"],
      enum: ["House", "Apartment", "Plot", "Commercial", "Other"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "In Progress", "Closed"],
      default: "New",
    },
    notes: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    score: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    source: {
      type: String,
      enum: ["Facebook Ads", "Walk-in", "Website", "Referral", "Other"],
      default: "Other",
    },
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

export default Lead;
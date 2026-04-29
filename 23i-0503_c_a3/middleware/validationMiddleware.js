import { NextResponse } from "next/server";

export function validateLeadData(body) {
  const errors = [];

  if (!body.name || body.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("Valid email is required");
  }

  if (!body.phone || body.phone.trim().length < 10) {
    errors.push("Valid phone number is required");
  }

  if (!body.budget || isNaN(body.budget) || Number(body.budget) <= 0) {
    errors.push("Valid budget is required");
  }

  if (!body.propertyInterest) {
    errors.push("Property interest is required");
  }

  return errors;
}

export function validateUserData(body) {
  const errors = [];

  if (!body.name || body.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("Valid email is required");
  }

  if (!body.password || body.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return errors;
}
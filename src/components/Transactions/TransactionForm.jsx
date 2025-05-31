// import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FaDollarSign,
  FaCalendarAlt,
  FaRegCommentDots,
  FaWallet,
} from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  listCategoriesAPI,
  addCategoryAPI,
} from "../../services/category/categoryService";
import { addTransactionAPI } from "../../services/transactions/transactionService";
import AlertMessage from "../Alert/AlertMessage";

const categoryValidationSchema = Yup.object({
  name: Yup.string().required("Category name is required"),
  type: Yup.string()
    .required("Category type is required")
    .oneOf(["income", "expense"]),
});

const transactionValidationSchema = Yup.object({
  type: Yup.string()
    .required("Transaction type is required")
    .oneOf(["income", "expense"]),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Must be positive"),
  category: Yup.string().required("Category is required"),
  date: Yup.date().required("Date is required"),
  description: Yup.string(),
});

const CategoryAndTransactionForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch categories
  const {
    data: categories,
    isError: isCatError,
    error: catError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["list-categories"],
    queryFn: listCategoriesAPI,
  });

  // Add Category Mutation
  const {
    mutateAsync: addCategory,
    isSuccess: isCatSuccess,
    isError: isCatAddErr,
    error: catAddError,
  } = useMutation({
    mutationFn: addCategoryAPI,
    onSuccess: () => {
      refetchCategories();
      categoryFormik.resetForm();
    },
  });

  // Add Transaction Mutation
  const {
    mutateAsync: addTransaction,
    isSuccess: isTranSuccess,
    isError: isTranErr,
    error: tranError,
  } = useMutation({
    mutationFn: addTransactionAPI,
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  // Category Formik
  const categoryFormik = useFormik({
    initialValues: { name: "", type: "" },
    validationSchema: categoryValidationSchema,
    onSubmit: async (values) => {
      await addCategory(values);
    },
  });

  // Transaction Formik
  const transactionFormik = useFormik({
    initialValues: {
      type: "",
      amount: "",
      category: "",
      date: "",
      description: "",
    },
    validationSchema: transactionValidationSchema,
    onSubmit: async (values) => {
      await addTransaction(values);
    },
  });

  return (
    <div className="max-w-2xl mx-auto my-10 space-y-10 bg-white p-6 rounded-lg shadow-lg">
      {/* Add Category Section */}
      <form onSubmit={categoryFormik.handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Add Category
        </h2>
        {isCatAddErr && (
          <AlertMessage
            type="error"
            message={
              catAddError?.response?.data?.message || "Category add failed"
            }
          />
        )}
        {isCatSuccess && (
          <AlertMessage type="success" message="Category added successfully" />
        )}
        <div className="space-y-2">
          <label
            htmlFor="type"
            className="flex gap-2 items-center text-gray-700 font-medium"
          >
            <FaWallet className="text-blue-500" /> Type
          </label>
          <select
            {...categoryFormik.getFieldProps("type")}
            id="type"
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {categoryFormik.touched.type && categoryFormik.errors.type && (
            <p className="text-red-500 text-xs">{categoryFormik.errors.type}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="name" className="text-gray-700 font-medium">
            <SiDatabricks className="inline text-blue-500 mr-1" />
            Name
          </label>
          <input
            type="text"
            {...categoryFormik.getFieldProps("name")}
            id="name"
            placeholder="Category name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {categoryFormik.touched.name && categoryFormik.errors.name && (
            <p className="text-red-500 text-xs">{categoryFormik.errors.name}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Category
        </button>
      </form>

      {/* Add Transaction Section */}
      <form onSubmit={transactionFormik.handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Add Transaction
        </h2>
        {isTranErr && (
          <AlertMessage
            type="error"
            message={tranError?.response?.data?.message || "Transaction failed"}
          />
        )}
        {isTranSuccess && (
          <AlertMessage
            type="success"
            message="Transaction added successfully"
          />
        )}
        {/* Transaction Fields */}
        <div className="space-y-2">
          <label
            htmlFor="type"
            className="flex gap-2 items-center text-gray-700 font-medium"
          >
            <FaWallet className="text-blue-500" /> Type
          </label>
          <select
            {...transactionFormik.getFieldProps("type")}
            id="type"
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {transactionFormik.touched.type && transactionFormik.errors.type && (
            <p className="text-red-500 text-xs">
              {transactionFormik.errors.type}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="text-gray-700 font-medium">
            <FaDollarSign className="inline text-blue-500 mr-1" /> Amount
          </label>
          <input
            type="number"
            {...transactionFormik.getFieldProps("amount")}
            id="amount"
            placeholder="Amount"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {transactionFormik.touched.amount &&
            transactionFormik.errors.amount && (
              <p className="text-red-500 text-xs">
                {transactionFormik.errors.amount}
              </p>
            )}
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-gray-700 font-medium">
            <FaRegCommentDots className="inline text-blue-500 mr-1" /> Category
          </label>
          <select
            {...transactionFormik.getFieldProps("category")}
            id="category"
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {transactionFormik.touched.category &&
            transactionFormik.errors.category && (
              <p className="text-red-500 text-xs">
                {transactionFormik.errors.category}
              </p>
            )}
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="text-gray-700 font-medium">
            <FaCalendarAlt className="inline text-blue-500 mr-1" /> Date
          </label>
          <input
            type="date"
            {...transactionFormik.getFieldProps("date")}
            id="date"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {transactionFormik.touched.date && transactionFormik.errors.date && (
            <p className="text-red-500 text-xs">
              {transactionFormik.errors.date}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-gray-700 font-medium">
            <FaRegCommentDots className="inline text-blue-500 mr-1" />{" "}
            Description
          </label>
          <textarea
            {...transactionFormik.getFieldProps("description")}
            id="description"
            rows="3"
            placeholder="Optional description"
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Submit Transaction
        </button>
      </form>
    </div>
  );
};

export default CategoryAndTransactionForm;

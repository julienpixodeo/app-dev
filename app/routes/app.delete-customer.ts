import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const body = await request.json();
  const email = body.email;

  // 1. Find customer by email
  const customerResponse = await admin.graphql(`
    query getCustomer($query: String!) {
      customers(first: 1, query: $query) {
        nodes {
          id
          email
        }
      }
    }
  `, {
    variables: {
      query: `email:${email}`,
    },
  });

  const customerData = await customerResponse.json();

  const customer =
    customerData.data.customers.nodes[0];

  if (!customer) {
    return json({
      success: false,
      error: "Customer not found",
    });
  }

  // 2. Delete customer
  const deleteResponse = await admin.graphql(`
    mutation customerDelete($input: CustomerDeleteInput!) {
      customerDelete(input: $input) {
        deletedCustomerId
        userErrors {
          field
          message
        }
      }
    }
  `, {
    variables: {
      input: {
        id: customer.id,
      },
    },
  });

  const deleteData = await deleteResponse.json();

  return json({
    success: true,
    data: deleteData,
  });
}
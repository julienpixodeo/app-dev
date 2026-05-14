import { Page, Card, Button, TextField } from "@shopify/polaris";
import { useState } from "react";

export default function TestPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function deleteCustomer() {
    if (!email) {
      alert("Please enter email");
      return;
    }

    setLoading(true);

    const response = await fetch("/app/delete-customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    console.log(data);

    if (data.success) {
      alert("Customer deleted!");
    } else {
      alert(data.error || "Delete failed");
    }

    setLoading(false);
  }

  return (
    <Page title="Delete Customer">
      <Card>
        <div style={{ padding: "20px" }}>
          <TextField
            label="Customer Email"
            value={email}
            onChange={setEmail}
            autoComplete="off"
          />

          <div style={{ marginTop: "20px" }}>
            <Button
              destructive
              loading={loading}
              onClick={deleteCustomer}
            >
              Delete Customer
            </Button>
          </div>
        </div>
      </Card>
    </Page>
  );
}
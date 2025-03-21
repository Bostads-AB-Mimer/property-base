## Naming conventions

- Use PascalCase for model names
- Use camelCase for field names
- Use singular for model names
- Use row for row fields or models (e.g. contractRow, invoiceRow etc., not line)
- Use transaction for transaction fields or models (e.g. contractTransaction, invoiceTransaction etc., not log)
- Use Signature for signature fields (e.g. contractSignature, invoiceSignature etc., not signing)
- Use Id for primary keys (e.g. contractId, not contractKey or just id)
- Use Date suffix to indicate date fields (e.g. contractStartDate, terminationDate, dueDate etc.)
- Use Amount suffix to indicate amount fields (e.g. contractAmount, totalAmount etc.)
- Use Tenant suffix to indicate tenant fields (e.g. contractTenant, tenantName etc.)
- Use Turnover for turnover fields (not revenue or income etc)
- Use By suffix to indicate user fields (e.g. createdBy, updatedBy etc.)
- Use Notice for notice fields (not warning or alert etc)
- When specifying differences between planned dates and real dates use Planned prefix (e.g. plannedStartDate, plannedEndDate etc.) and Real prefix (e.g. realStartDate, realEndDate etc.)
- Use Rent for rent fields (not fee or charge etc)
- When you are uncertain about the naming, use comments to explain your reasoning
- When you realise you don't have enough information to rename a model, leave the model name as is and make a TODO: comment about changing it later when there will be a backward pass through the models again to change these names.

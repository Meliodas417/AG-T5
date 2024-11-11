from kpi_formula.core.data_manager import DataManager

manager = DataManager()

data_item = manager.import_csv('sales_data.csv')
print(f"data headers: {data_item.headers}")
print(f"total lines: {len(data_item.data)}")

manager.update_cell(row_index=0, col_index=1, value="100")

manager.export_csv(data_item, 'updated_sales.csv')

print(f"history: {len(manager.history)}")
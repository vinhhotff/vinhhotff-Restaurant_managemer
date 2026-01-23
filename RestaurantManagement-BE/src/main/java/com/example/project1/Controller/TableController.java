package com.example.project1.Controller;

import com.example.project1.Service.Ipm.ITableService;
import com.example.project1.dto.request.TableRequest;
import com.example.project1.dto.response.ApiResponse;
import com.example.project1.dto.response.TableResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TableController {
    private final ITableService tableService;
    public TableController(ITableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TableResponse>>> getAllTables() {
        List<TableResponse> tables = tableService.getAllTables();

        return ResponseEntity.ok(
                ApiResponse.success(tables, "Get all Tables successfully")
        );
    }

    @GetMapping("/{name}")
    public ResponseEntity<ApiResponse<TableResponse>> getAllTablesByName(@PathVariable String name) {
        TableResponse table = tableService.getTableByName(name);
        return ResponseEntity.ok(
                ApiResponse.success(table, "Get Tables by name successfully")
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TableResponse>> createTables(@Valid @RequestBody TableRequest tableRequest) {
        TableResponse table = tableService.createTable(tableRequest);
        ApiResponse<TableResponse> apiResponse = ApiResponse.success(table, "Create Table successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TableResponse>> updateTables(@PathVariable Integer id ,@Valid @RequestBody TableRequest tableRequest) {
        TableResponse table = tableService.updateTable(id, tableRequest);
        ApiResponse<TableResponse> apiResponse = ApiResponse.success(table, "Update Table successfully");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<TableResponse>> deleteTables(@PathVariable Integer id) {
        tableService.deleteTable(id);
        return ResponseEntity.ok(
                ApiResponse.success(null, "Reservation deleted successfully")
        );
    }
}

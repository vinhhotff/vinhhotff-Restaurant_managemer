package com.example.project1.Controller;

import com.example.project1.Service.Ipm.ITableService;
import com.example.project1.dto.response.ApiResponse;
import com.example.project1.dto.response.TableResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}

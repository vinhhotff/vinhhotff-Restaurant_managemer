package com.example.project1.Service.Ipm;

import com.example.project1.dto.request.TableRequest;
import com.example.project1.dto.response.TableResponse;

import java.util.List;

public interface ITableService {
    List<TableResponse> getAllTables();
    TableResponse getTableByName(String name);
    TableResponse createTable(TableRequest tableRequest);
    TableResponse updateTable(Integer id,TableRequest tableRequest);
    void deleteTable(Integer id);
}

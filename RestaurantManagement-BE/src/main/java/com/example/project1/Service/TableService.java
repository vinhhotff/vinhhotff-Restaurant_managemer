package com.example.project1.Service;

import com.example.project1.Models.Reservation;
import com.example.project1.Models.Restaurant;
import com.example.project1.Models.RestaurantArea;
import com.example.project1.Models.Tables;
import com.example.project1.Repository.RestaurantAreaRepository;
import com.example.project1.Repository.RestaurantRepository;
import com.example.project1.Repository.TablesRepository;
import com.example.project1.Service.Ipm.ITableService;
import com.example.project1.dto.request.TableRequest;
import com.example.project1.dto.response.TableResponse;
import com.example.project1.mapper.TableMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TableService  implements ITableService {
    private final TablesRepository tablesRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantAreaRepository restaurantAreaRepository;
    private final TableMapper tableMapper;

    public TableService(TablesRepository tablesRepository, RestaurantRepository restaurantRepository, RestaurantAreaRepository restaurantAreaRepository, TableMapper tableMapper) {

        this.tablesRepository = tablesRepository;
        this.restaurantRepository = restaurantRepository;
        this.restaurantAreaRepository = restaurantAreaRepository;
        this.tableMapper = tableMapper;
    }
    @Override
    public List<TableResponse> getAllTables() {
        List<Tables> tables = this.tablesRepository.findAll();
        return tables.stream()
                .map(tableMapper::toResponse)
                .toList();
    }

    @Override
    public TableResponse getTableByName(String name) {
        Tables table = this.tablesRepository.findByTableName(name)
                .orElseThrow(() -> new RuntimeException("The table not found!!"));
        return tableMapper.toResponse(table);
    }

    @Override
    public TableResponse createTable(TableRequest tableRequest) {

        Restaurant restaurant = restaurantRepository.findById(tableRequest.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("The restaurant_id not found!!"));

        RestaurantArea restaurantArea = restaurantAreaRepository.findById(tableRequest.getAreaId())
                .orElseThrow(() -> new RuntimeException("The area_id not found!!"));

        String tableName = tableRequest.getTableName();
        if(tablesRepository.findByTableName(tableName).isPresent()) {
            throw new RuntimeException("TableName code already exists: " + tableName);
        }

        Tables table = tableMapper.toEntity(tableRequest);
        table.setRestaurant(restaurant);
        table.setArea(restaurantArea);
        table.setCreatedAt(Instant.now());

        Tables savedTable = tablesRepository.save(table);
        return tableMapper.toResponse(savedTable);
    }

    @Override
    public TableResponse updateTable(Integer id, TableRequest tableRequest) {

        Tables tablesResult = this.tablesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        Restaurant restaurant = restaurantRepository.findById(tableRequest.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("The restaurant_id not found!!"));

        RestaurantArea restaurantArea = restaurantAreaRepository.findById(tableRequest.getAreaId())
                .orElseThrow(() -> new RuntimeException("The area_id not found!!"));

        tableMapper.updateEntity(tablesResult,tableRequest);

        tablesResult.setRestaurant(restaurant);
        tablesResult.setArea(restaurantArea);
        tablesResult.setUpdatedAt(Instant.now());
        Tables updatedTable = tablesRepository.save(tablesResult);

        return tableMapper.toResponse(updatedTable);
    }

    @Override
    public void deleteTable(Integer id) {

        Tables tablesResult = this.tablesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table already deleted"));

        tablesRepository.delete(tablesResult);
    }
}

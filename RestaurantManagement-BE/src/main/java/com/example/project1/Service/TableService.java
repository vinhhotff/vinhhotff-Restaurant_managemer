package com.example.project1.Service;

import com.example.project1.Models.Tables;
import com.example.project1.Repository.RestaurantAreaRepository;
import com.example.project1.Repository.RestaurantRepository;
import com.example.project1.Repository.TablesRepository;
import com.example.project1.Service.Ipm.ITableService;
import com.example.project1.dto.request.TableRequest;
import com.example.project1.dto.response.TableResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableService  implements ITableService {
    private final TablesRepository tablesRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantAreaRepository restaurantAreaRepository;
    public TableService(TablesRepository tablesRepository, RestaurantRepository restaurantRepository, RestaurantAreaRepository restaurantAreaRepository) {

        this.tablesRepository = tablesRepository;
        this.restaurantRepository = restaurantRepository;
        this.restaurantAreaRepository = restaurantAreaRepository;
    }
    @Override
    public List<TableResponse> getAllTables() {
        List<Tables> tables = this.tablesRepository.findAll();

        return tables.stream()
                .map(table -> new TableResponse(
                        table.getId(),
                        table.getRestaurant().getId(),
                        table.getArea().getId(),
                        table.getTableNumber(),
                        table.getTableName(),
                        table.getCapacity(),
                        table.getMinPersons(),
                        table.getPositionDescription(),
                        table.getFeatures(),
                        table.getCreatedAt()
                 ))
                .toList();
    }

    @Override
    public TableResponse getTableByName(String name) {
        Tables table = this.tablesRepository.findByTableName(name)
                .orElseThrow(() -> new RuntimeException("The table not found!!"));
        
        return new TableResponse(
                table.getId(),
                table.getRestaurant().getId(),
                table.getArea().getId(),
                table.getTableNumber(),
                table.getTableName(),
                table.getCapacity(),
                table.getMinPersons(),
                table.getPositionDescription(),
                table.getFeatures(),
                table.getCreatedAt()
        );
    }

    @Override
    public TableResponse createTable(TableRequest tableRequest) {
        return null;
    }

    @Override
    public TableResponse updateTable(Integer id, TableRequest tableRequest) {
        return null;
    }
}

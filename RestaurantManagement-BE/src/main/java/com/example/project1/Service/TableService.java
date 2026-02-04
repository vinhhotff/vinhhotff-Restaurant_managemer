package com.example.project1.Service;

import com.example.project1.Models.Restaurant;
import com.example.project1.Models.RestaurantArea;
import com.example.project1.Models.Tables;
import com.example.project1.Repository.RestaurantAreaRepository;
import com.example.project1.Repository.RestaurantRepository;
import com.example.project1.Repository.TablesRepository;
import com.example.project1.Service.Ipm.ITableService;
import com.example.project1.dto.request.TableRequest;
import com.example.project1.dto.response.TableResponse;
import com.example.project1.exception.AppException;
import com.example.project1.mapper.TableMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TableService implements ITableService {
        private final TablesRepository tablesRepository;
        private final RestaurantRepository restaurantRepository;
        private final RestaurantAreaRepository restaurantAreaRepository;
        private final TableMapper tableMapper;

        @Override
        public List<TableResponse> getAllTables() {
                return tablesRepository.findAll().stream()
                                .map(tableMapper::toResponse)
                                .toList();
        }

        @Override
        public TableResponse getTableByName(String name) {
                Tables table = tablesRepository.findByTableName(name)
                                .orElseThrow(() -> new AppException("Table not found: " + name, 404));
                return tableMapper.toResponse(table);
        }

        @Override
        public TableResponse createTable(TableRequest tableRequest) {
                if (tablesRepository.findByTableName(tableRequest.getTableName()).isPresent()) {
                        throw new AppException("Table name already exists: " + tableRequest.getTableName(), 409);
                }

                Restaurant restaurant = restaurantRepository.findById(tableRequest.getRestaurantId())
                                .orElseThrow(() -> new AppException(
                                                "Restaurant not found with ID: " + tableRequest.getRestaurantId(),
                                                404));

                RestaurantArea restaurantArea = restaurantAreaRepository.findById(tableRequest.getAreaId())
                                .orElseThrow(() -> new AppException(
                                                "Area not found with ID: " + tableRequest.getAreaId(), 404));

                Tables table = tableMapper.toEntity(tableRequest);
                table.setRestaurant(restaurant);
                table.setArea(restaurantArea);
                table.setCreatedAt(Instant.now());

                return tableMapper.toResponse(tablesRepository.save(table));
        }

        @Override
        public TableResponse updateTable(Integer id, TableRequest tableRequest) {
                Tables table = tablesRepository.findById(id)
                                .orElseThrow(() -> new AppException("Table not found with ID: " + id, 404));

                Restaurant restaurant = restaurantRepository.findById(tableRequest.getRestaurantId())
                                .orElseThrow(() -> new AppException(
                                                "Restaurant not found with ID: " + tableRequest.getRestaurantId(),
                                                404));

                RestaurantArea restaurantArea = restaurantAreaRepository.findById(tableRequest.getAreaId())
                                .orElseThrow(() -> new AppException(
                                                "Area not found with ID: " + tableRequest.getAreaId(), 404));

                tableMapper.updateEntity(table, tableRequest);
                table.setRestaurant(restaurant);
                table.setArea(restaurantArea);
                table.setUpdatedAt(Instant.now());

                return tableMapper.toResponse(tablesRepository.save(table));
        }

        @Override
        public void deleteTable(Integer id) {
                Tables table = tablesRepository.findById(id)
                                .orElseThrow(() -> new AppException("Table not found or already deleted with ID: " + id,
                                                404));
                tablesRepository.delete(table);
        }
}

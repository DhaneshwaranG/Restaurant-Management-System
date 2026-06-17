package com.dhanesh.restaurant.service;

import com.dhanesh.restaurant.entity.MenuItem;
import com.dhanesh.restaurant.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {

    private final MenuItemRepository repository;

    public MenuItemService(MenuItemRepository repository) {
        this.repository = repository;
    }

    public List<MenuItem> getAllMenuItems() {
        return repository.findAll();
    }

    public MenuItem saveMenuItem(MenuItem menuItem) {
        return repository.save(menuItem);
    }

    public void deleteMenuItem(Long id) {
        repository.deleteById(id);
    }
}
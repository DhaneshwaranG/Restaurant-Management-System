package com.dhanesh.restaurant.service;

import com.dhanesh.restaurant.entity.Order;
import com.dhanesh.restaurant.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository repository;

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    public Order saveOrder(Order order) {
        return repository.save(order);
    }

    public List<Order> getAllOrders() {
        return repository.findAll();
    }

    public void deleteOrder(Long id) {
        repository.deleteById(id);
    }

    public Order updateOrder(Long id, Order updatedOrder) {

        Order existingOrder = repository.findById(id).orElseThrow();

        existingOrder.setStatus(updatedOrder.getStatus());

        return repository.save(existingOrder);
    }
}
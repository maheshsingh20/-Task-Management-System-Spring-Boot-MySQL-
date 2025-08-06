package com.taskmanager.repository;

import com.taskmanager.model.Task;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.model.TaskPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
    List<Task> findByUserIdAndStatus(Long userId, TaskStatus status);
    List<Task> findByUserIdAndPriority(Long userId, TaskPriority priority);
    
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.deadline BETWEEN :startDate AND :endDate")
    List<Task> findByUserIdAndDeadlineBetween(@Param("userId") Long userId, 
                                              @Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.deadline < :currentDate AND t.status != 'DONE'")
    List<Task> findOverdueTasks(@Param("userId") Long userId, @Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId ORDER BY t.deadline ASC")
    List<Task> findByUserIdOrderByDeadlineAsc(@Param("userId") Long userId);
}
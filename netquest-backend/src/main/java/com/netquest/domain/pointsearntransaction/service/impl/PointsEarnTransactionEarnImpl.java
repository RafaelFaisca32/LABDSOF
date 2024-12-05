package com.netquest.domain.pointsearntransaction.service.impl;

import com.netquest.domain.pointsearntransaction.dto.*;
import com.netquest.domain.pointsearntransaction.mapper.PointsEarnTransactionMapper;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;
import com.netquest.domain.pointsearntransaction.service.PointsEarnTransactionService;
import com.netquest.domain.user.exception.UserNotFoundException;
import com.netquest.domain.user.model.UserId;
import com.netquest.domain.user.service.UserService;
import com.netquest.infrastructure.pointsearntransaction.PointsEarnTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@RequiredArgsConstructor
@Service
public class PointsEarnTransactionEarnImpl implements PointsEarnTransactionService {
    private final PointsEarnTransactionRepository pointsEarnTransactionRepository;
    private final PointsEarnTransactionMapper pointsEarnTransactionMapper;
    private final UserService userService;

    @Override
    public PointsEarnTransactionDto savePointsEarnTransactionByVisit(PointsEarnTransactionCreateByVisitDto pointsEarnTransactionCreateByVisitDto) {
        PointsEarnTransaction pointsEarnTransaction = pointsEarnTransactionMapper
                .toNewEntityByVisit(pointsEarnTransactionCreateByVisitDto);

        return pointsEarnTransactionMapper.toDto(pointsEarnTransactionRepository.save(pointsEarnTransaction));
    }

    @Override
    public PointsEarnTransactionDto savePointsEarnTransactionByWifiSpotCreation(PointsEarnTransactionCreateByWifiSpotCreationDto pointsEarnTransactionCreateByWifiSpotCreationDto) {
        PointsEarnTransaction pointsEarnTransaction = pointsEarnTransactionMapper
                .toNewEntityByWifiSpotCreation(pointsEarnTransactionCreateByWifiSpotCreationDto);
        return pointsEarnTransactionMapper.toDto(pointsEarnTransactionRepository.save(pointsEarnTransaction));
    }

    @Override
    public Page<LeaderboardEntryDto> getLeaderboard(Pageable pageable) {


        Page<TotalPointsEarnByUserDto> totalPointsEarnByUserDtosPage = pointsEarnTransactionRepository.getLeaderboard(pageable);
        AtomicInteger startRank = new AtomicInteger(pageable.getPageNumber() * pageable.getPageSize() + 1);

        List<LeaderboardEntryDto> leaderboardList = totalPointsEarnByUserDtosPage.getContent().stream()
                .map(item -> new LeaderboardEntryDto(
                        startRank.getAndIncrement(),
                        item.getUserId(),
                        item.getPoints()
                ))
                .toList();

        // Return a new Page with ranks
        return new PageImpl<>(leaderboardList, pageable, totalPointsEarnByUserDtosPage.getTotalElements());
    }

    @Override
    public Page<PointsEarnTransactionDto> getPointsEarnTransactionsByUser(UUID userUUID, Pageable pageable) {

        if(!userService.existsById(userUUID)){
            throw new UserNotFoundException("User not found");
        }

        UserId userId = new UserId(userUUID);

        return pointsEarnTransactionRepository.findByUserIdOrderByPointsEarnTransactionDateTimeDesc(userId,pageable).map(pointsEarnTransactionMapper::toDto);
    }
}

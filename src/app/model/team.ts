export interface Team {
    id?: number;
    name?: string;
    position?: number;
    points?: string;
    goalDifference?: string;
    //total stats
    totalMp?: number;
    totalWon?: number;
    totalDraw?: number;
    totalLost?: number;
    totalGoalF?: number;
    totalGoalS?: number;
    //home stats
    homeMp?: number;
    homeWon?: number;
    homeDraw?: number;
    homeLost?: number;
    homeGoalF?: number;
    homeGoalS?: number;
    //away stats
    awayMp?: number;
    awayWon?: number;
    awayDraw?: number;
    awayLost?: number;
    awayGoalF?: number;
    awayGoalS?: number;
}
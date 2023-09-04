import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SoccerDataService } from '../services/soccer-data.service';
import { Team } from '../model/team';
import { Match } from '../model/match';
import { leagueList } from '../data/leagueList';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public serverResponse: any = "";
  @ViewChild('standing') stand!: ElementRef;
  @ViewChild('match') match!: ElementRef;
  standingStats: Array<Team> = [];
  matchDayList: Array<Match> = [];
  //leagueList: Map<string,string>;
  leagueList: Array<any> = [];
  currentLeague: string;
  currentLeagueLabel: string;

  leaguesDays: number[];
  currentMatchDay: number;

  constructor(private soccerDataService: SoccerDataService) {
    
    Array.from(leagueList.keys()).forEach(element => {
      this.leagueList.push({id: element, label: leagueList.get(element)})
    });

    
    this.leagueList = this.leagueList.sort((a,b) => a.label - b.label);
    this.currentLeague = "23709_77308_13";
    this.currentLeagueLabel = leagueList.get(this.currentLeague);
    this.leaguesDays = [];
    this.currentMatchDay = 0;
  }

  ngOnInit(): void {

    //var seasonId = 23480;
    //var roundId = 76333;
    //var competionId = 70;
    //var matchDayIndex = 1 //da recuperare dalle partite giocate +1
    var seasonId = this.currentLeague.split("_")[0];
    var roundId = this.currentLeague.split("_")[1];
    var competionId = this.currentLeague.split("_")[2];

    this.soccerDataService.getSoccerStanding(seasonId, roundId, competionId).subscribe((data) => {
      this.stand.nativeElement.innerHTML = data.commands[0].parameters.content;
      this.standingsParse();
      this.leaguesDays = [];
      for(let i = 0; i < (this.standingStats.length -1) * 2; i++) {
        this.leaguesDays.push(i);
      }
      this.currentMatchDay = this.standingStats[0].totalMp;

      this.soccerDataService.getSoccerMatchDay(roundId, competionId, this.currentMatchDay).subscribe((data) => {
        this.match.nativeElement.innerHTML = data.commands[0].parameters.content;
        this.matchDayParsing();
      });

    });

  }

  changeLeague() {

    var seasonId = this.currentLeague.split("_")[0];
    var roundId = this.currentLeague.split("_")[1];
    var competionId = this.currentLeague.split("_")[2];
    this.currentLeagueLabel = leagueList.get(this.currentLeague);

    this.soccerDataService.getSoccerStanding(seasonId, roundId, competionId).subscribe((data) => {
      this.stand.nativeElement.innerHTML = data.commands[0].parameters.content;
      this.standingsParse();
      this.leaguesDays = [];
      for(let i = 0; i < (this.standingStats.length -1) * 2; i++) {
        this.leaguesDays.push(i);
      }
      this.currentMatchDay = this.standingStats[0].totalMp;

      this.soccerDataService.getSoccerMatchDay(roundId, competionId, this.currentMatchDay).subscribe((data) => {
        this.match.nativeElement.innerHTML = data.commands[0].parameters.content;
        this.matchDayParsing();
      });

    });
  }

  changeDayOfLeague() {

    var roundId = this.currentLeague.split("_")[1];
    var competionId = this.currentLeague.split("_")[2];

    this.soccerDataService.getSoccerMatchDay(roundId, competionId, this.currentMatchDay).subscribe((data) => {
      this.match.nativeElement.innerHTML = data.commands[0].parameters.content;
      this.matchDayParsing();
    });
  }

  standingsParse() {

    this.standingStats = [];
    var trList = document.getElementById('standing_div')?.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].children as HTMLCollection;

    for (let i = 0; i < trList.length; i++) {
      this.standingParserRow(trList[i] as HTMLTableRowElement);
    }
  }

  standingParserRow(itemTr: HTMLTableRowElement) {

    var currentTr = itemTr;
    currentTr.getAttribute("data-team_id");
    var currentTeam: Team = {};
    currentTeam.id = Number(currentTr.getAttribute("data-team_id"));

    var cellList = currentTr.cells;
    
    for (let j = 0; j < cellList.length; j++) {
      var currentCell = cellList[j];
      var cellClassName = currentCell.className;
      currentTeam.position = Number(cellList[0].innerHTML);

      switch (cellClassName) {
        case "rank rank-dark-green":
          //currentTeam.position = Number(currentCell.innerHTML);
          break;
        case "text team large-link":
          currentTeam.name = (currentCell.childNodes[0] as HTMLHRElement).title;
          break;
        case "number total mp":
          currentTeam.totalMp = Number(currentCell.innerHTML);
          break;
        case "number total won total_won":
          currentTeam.totalWon = Number(currentCell.innerHTML);
          break;
        case "number total drawn total_drawn":
          currentTeam.totalDraw = Number(currentCell.innerHTML);
          break;
        case "number total lost total_lost":
          currentTeam.totalLost = Number(currentCell.innerHTML);
          break;
        case "number total gf total_gf":
          currentTeam.totalGoalF = Number(currentCell.innerHTML);
          break;
        case "number total ga total_ga":
          currentTeam.totalGoalS = Number(currentCell.innerHTML);
          break;
        case "number home mp home_total":
          currentTeam.homeMp = Number(currentCell.innerHTML);
          break;
        case "number home won home_won":
          currentTeam.homeWon = Number(currentCell.innerHTML);
          break;
        case "number home drawn home_drawn":
          currentTeam.homeDraw = Number(currentCell.innerHTML);
          break;
        case "number home lost home_lost":
          currentTeam.homeLost = Number(currentCell.innerHTML);
          break;
        case "number home gf home_gf":
          currentTeam.homeGoalF = Number(currentCell.innerHTML);
          break;
        case "number home ga home_ga":
          currentTeam.homeGoalS = Number(currentCell.innerHTML);
          break;
        case "number away mp away_total":
          currentTeam.awayMp = Number(currentCell.innerHTML);
          break;
        case "number away won away_won":
          currentTeam.awayWon = Number(currentCell.innerHTML);
          break;
        case "number away drawn away_drawn":
          currentTeam.awayDraw = Number(currentCell.innerHTML);
          break;
        case "number away lost away_lost":
          currentTeam.awayLost = Number(currentCell.innerHTML);
          break;
        case "number away gf away_gf":
          currentTeam.awayGoalF = Number(currentCell.innerHTML);
          break;
        case "number away ga away_ga":
          currentTeam.awayGoalS = Number(currentCell.innerHTML);
          break;
        case "number gd":
          currentTeam.goalDifference = currentCell.innerHTML;
          break;
        case "number points":
          currentTeam.points = currentCell.innerHTML;
          break;

        default:
          break;
      }

    }

    this.standingStats.push(currentTeam);

  }

  matchDayParsing() {
    this.matchDayList = [];
    var trList = document.getElementById('match_div')?.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].children as HTMLCollection;

    for (let i = 0; i < trList.length; i++) {
      if(i%2 == 1) {
        this.matchDayParserRow(trList[i] as HTMLTableRowElement);
      }
    }
  }

  matchDayParserRow(itemTr: HTMLTableRowElement) {
    try {
    var currentTr = itemTr;
    var currentMatch: Match = {};
    currentMatch.matchTime = Number(currentTr.getAttribute("data-timestamp"));
    var homeTeamHref = (currentTr.getElementsByClassName("team team-a ")[0].childNodes[0] as HTMLHRElement).getAttribute("href")!;
    var homeTeamId = Number(homeTeamHref.split("/")[homeTeamHref.split("/").length -2]);
    currentMatch.homeTeamId = homeTeamId;
    currentMatch.homeTeamName = (currentTr.getElementsByClassName("team team-a ")[0].childNodes[0] as HTMLHRElement).title;
    
    var awayTeamHref = (currentTr.getElementsByClassName("team team-b ")[0].childNodes[0] as HTMLHRElement).getAttribute("href")!;
    var awayTeamId = Number(awayTeamHref.split("/")[awayTeamHref.split("/").length -2]);
    currentMatch.awayTeamId = awayTeamId;
    currentMatch.awayTeamName = (currentTr.getElementsByClassName("team team-b ")[0].childNodes[0] as HTMLHRElement).title;
    
    currentMatch.matchRes = currentTr.getElementsByClassName("extra_time_score ")[0]?.innerHTML;
    
    this.matchDayList.push(currentMatch);
    this.fillMatchStatsAndPrediction(currentMatch);
    } catch {}

  }

  fillMatchStatsAndPrediction(matchItem: Match) {

    var thome: Team = this.standingStats.filter(x => x.id == matchItem.homeTeamId)[0];
    var taway: Team = this.standingStats.filter(x => x.id == matchItem.awayTeamId)[0];

    //inizializzazione varibali valori
    var segno1: number = (thome.homeWon + taway.awayLost) / (thome.homeMp + taway.awayMp);
    var segnox: number = (thome.homeDraw + taway.awayDraw) / (thome.homeMp + taway.awayMp);
    var segno2: number = (thome.homeLost + taway.awayWon) / (thome.homeMp + taway.awayMp);
    this.matchDayList.forEach(element => {

      if(element.homeTeamId == thome.id && element.awayTeamId == taway.id) {
        element.stat_1 = Number(segno1.toFixed(2));
        element.stat_x = Number(segnox.toFixed(2));
        element.stat_2 = Number(segno2.toFixed(2));
        element.predFixed = this.getSignPrediction(segno1, segnox, segno2);
        element.pred_gg_ng = this.getGgNgPrediction(thome,taway);
      }
    });

  }

  getSignPrediction(s1: number, sx: number, s2: number) {

    var arrS: any[] = [
      {s: "1", value: s1}, 
      {s: "x", value: sx}, 
      {s: "2", value: s2}
    ];
    arrS = arrS.sort((a,b) => {return b.value - a.value});
    if(arrS[0].value >= 0.5 && arrS[1].value <= 0.25) {
      return arrS[0].s;
    }

    if(arrS[2].value <= 0.15) {
      return arrS[0].s + arrS[1].s;
    }

    if(arrS[2].value > 0.15) {
      return arrS[0].s + arrS[2].s;
    }

  }

  getGgNgPrediction(ht: Team, at: Team) {

    var calcolo = ((ht.homeGoalF / ht.homeMp) + (at.awayGoalF / at.awayMp)) / 2;
    return Number(calcolo.toFixed(2));

  }

}

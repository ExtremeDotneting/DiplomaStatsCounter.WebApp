using System;

namespace TEMPLATE_APP.WebApp.Dto
{
    public class DayStatistics
    {
        public int DayNumber { get; set; }

        public DateTime DayDate { get; set; }

        public int CommitsCount { get; set; }

        public int AdditionsLinesCount { get; set; }

        public int DeletionsLinesCount { get; set; }

        public int NewLinesCount { get; set; }

        public int TotalLinesCount { get; set; }

        public int TotalCommitsCount { get; set; }
    }
}
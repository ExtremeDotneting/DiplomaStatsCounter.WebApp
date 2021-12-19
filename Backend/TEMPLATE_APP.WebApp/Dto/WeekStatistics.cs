using System;

namespace TEMPLATE_APP.WebApp.Dto
{
    public class WeekStatistics
    {
        public int WeekNumber { get; set; }

        public DateTime WeekDate { get; set; }

        public long CommitsCount { get; set; }

        public long AdditionsLinesCount { get; set; }

        public long DeletionsLinesCount { get; set; }

        public long NewLinesCount { get; set; }

        public long TotalLinesCount { get; set; }

        public long TotalCommitsCount { get; set; }

        public long AuthorsCount { get; set; }
    }
}
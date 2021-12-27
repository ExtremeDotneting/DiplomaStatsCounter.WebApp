using System;
using Statistics;
using Statistics.Models;

namespace ConsoleApp1
{
    static class SimpleTests
    {
        public static void MultipleTest()
        {
            decimal[] y = { 0.9M, 1.7M, 0.7M, 1.7M, 2.6M, 1.3M, 4.1M, 1.6M, 6.9M, 0.4M };

            decimal[] x1 = { 31.3M, 13.4M, 4.5M, 10, 20, 15, 137.1M, 17.9M, 165.4M, 2 };
            decimal[] x2 = { 18.9M, 13.7M, 18.5M, 4.8M, 21.8M, 5.8M, 99, 20.1M, 60.6M, 1.4M };

            var mlr = new MultipleLinearRegression();
            mlr.Compute(y, x1, x2);

            Console.WriteLine(mlr.Coefs[0]);
            Console.WriteLine(mlr.Coefs[1]);
            Console.WriteLine(mlr.Coefs[2]);

            Console.WriteLine(mlr.RValues[0]);
            Console.WriteLine(mlr.RValues[1]);
        }

        public static void LinearRegression_Example()
        {
            decimal[] x = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
            decimal[] y = { 8, 6, 10, 6, 10, 13, 9, 11, 15, 17 };

            var lr = new LinearRegression();
            lr.Compute(y, x);

            Console.WriteLine("y = {0} + {1} * x + error", lr.Alpha, lr.Beta);
            Console.WriteLine("r_value = {0}", lr.RValue);
            Console.WriteLine("r_squared = {0}", lr.RSquared);
        }

        public static void LogitRegression_Example()
        {
            bool[] y = { true, true, true, false, true, false, false, true, false };
            decimal[] x = { 1, 3, 2, 23, 1, 36, 35, 5, 17 };

            var logitRegression = new LogitRegression();
            logitRegression.Compute(y, x);

            var result = logitRegression.PredictValue(new decimal[] { 17 });
            Console.WriteLine("Result = {0}", result);
        }

        public static void SMA_Example()
        {
            decimal[] values = { 1, 3, 5, 7, 9, 2, 4, 6, 8, 11, 13, 15, 24, 46, 68 };

            var result = MovingAverages.SMA(values, 5);
        }

        public static void MatrixInverse_Example()
        {
            decimal[][] m = new decimal[3][]
            {
                new decimal[3] {  1,   4,   10  },
                new decimal[3] {  1,   2,   8   },
                new decimal[3] {  0,   1,   4   }
            };

            var matrix = new Matrix(m, copy: true);

            var inversedMatrix = matrix.Inverse();
        }
    }
}
using System;
using Accord.Math.Optimization.Losses;
using Accord.Statistics.Models.Regression.Linear;

namespace ConsoleApp1
{
    static class AccordTests
    {
        public static void MultipleTest()
        {
            // Declare some sample test data.
            double[][] inputs =
            {
                Data2.X1_Array,
                Data2.X2_Array
            };

            double[] outputs = Data2.Y_Array;


            // Use Ordinary Least Squares to learn the regression
            var mlr = new OrdinaryLeastSquares()
            {
                UseIntercept = true
            };

            // Use OLS to learn the simple linear regression
            var regression= mlr.Learn(inputs, outputs);

            // We can obtain predictions using
            var predictions = regression.Transform(inputs);

            // The prediction error is
            double error = new SquareLoss(outputs).Loss(predictions); // 0


            Console.WriteLine("C_1 = " + regression.Weights[0]);
            Console.WriteLine("C_2 = " + regression.Weights[1]);
            Console.WriteLine("C_3 = " + regression.Weights[2]);

            Console.WriteLine("Intercept_1 = " + regression.Intercept);
        }

    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Accord.Math.Optimization.Losses;
using Accord.Statistics.Models.Regression.Linear;

namespace TEMPLATE_APP.WebApp.Services
{
    public static class MathTests
    {
        public static void Run()
        {
            Test1();
        }

        public static void Test1()
        {
            // Declare some sample test data.
            double[][] inputs =
            {
                X1_Array,
                X2_Array 
            };

            double[][] outputs =
            {
                Y_Array
            };

            // Use Ordinary Least Squares to learn the regression
            OrdinaryLeastSquares ols = new OrdinaryLeastSquares();

            // Use OLS to learn the simple linear regression
            MultivariateLinearRegression regression = ols.Learn(inputs, outputs);

            // We can obtain predictions using
            double[][] predictions = regression.Transform(inputs);

            // The prediction error is
            double error = new SquareLoss(outputs).Loss(predictions); // 0
        }

        static double[] X1_Array { get; } =
        {
            1757,
            1533,
            2023,
            1834,
            2967,
            1574,
            2094,
            2044,
            1537,
            1949,
            1465,
            2954,
            1583,
            3098,
            1532,
            2590,
            2145,
            1107,
            1648,
            2274,
            2820,
            1694,
            3547,
            1755,
            1866,
            2693,
            1187,
            1276,
            1177,
            1215,
            2580,
            2837,
            2709,
            1638,
        };

        static double[] X2_Array { get; } =
        {
            254,
            430,
            467,
            450,
            108,
            417,
            337,
            495,
            358,
            101,
            246,
            234,
            285,
            101,
            185,
            485,
            495,
            301,
            348,
            470,
            448,
            340,
            362,
            376,
            462,
            297,
            297,
            453,
            449,
            116,
            261,
            342,
            277,
            165
        };

        static double[] Y_Array { get; } =
        {
            2530,
            4659,
            3470,
            3980,
            5607,
            3456,
            3977,
            3913,
            3399,
            4308,
            3289,
            4789,
            3336,
            3982,
            2967,
            3981,
            3958,
            2530,
            3370,
            4257,
            4578,
            3587,
            5285,
            2890,
            4022,
            4856,
            2987,
            3978,
            2405,
            2645,
            3958,
            4528,
            5154,
            3347
        };
    }
}

using System;
using System.Text;
using Accord.Math.Optimization.Losses;
using Accord.Statistics.Models.Regression.Linear;
using MultipleLinearRegression = Statistics.Models.MultipleLinearRegression;

namespace ConsoleApp1
{
    static class HardTests
    {
        public static void MultipleTest()
        {
            double[] X1 = Data2.X1_Array;
            double[] X2 = Data2.X2_Array;
            double[] Y = Data2.Y_Array;

            double[] Units = GenerateUnits(Y);

            double[] X1_log10 = Log10(X1);
            double[] X2_log10 = Log10(X2);
            double[] Y_log10 = Log10(Y);

            var matrix = MatrixFromArrays(Units, X1_log10, X2_log10);
            var matrixTrans = TransposeMatrix(matrix);

            var X_mult_X = MatrixMultiplication(matrixTrans, matrix);
            PrintMatrix(X_mult_X);

            var inverse_X_mult_X = InverseMatrix(X_mult_X);
            PrintMatrix(inverse_X_mult_X);

            var trans_Y = MatrixFromArrays(Y_log10);
            var X_mult_Y = MatrixMultiplication(matrixTrans, trans_Y);
            PrintMatrix(X_mult_Y);

            var coefs = MatrixMultiplication(inverse_X_mult_X, X_mult_Y);
            PrintMatrix(coefs);
        }


        static double[][] InverseMatrix(double[][] matrix)
        {
            return MatrixInverseHelper.MatrixInverse(matrix);
        }

        static void PrintMatrix(double[][] matrix)
        {
            const int spacesCount = 10;
            var lineLength = matrix[0].Length * (spacesCount + 1) + 1;

            var delimerLine = "";
            for (var i = 0; i < lineLength; i++)
            {
                delimerLine += "—";
            }

            var str = "\n\n" + delimerLine + "\n";
            for (var i = 0; i < matrix.Length; i++)
            {
                for (var j = 0; j < matrix[i].Length; j++)
                {

                    str += "|";
                    var numStr = String.Format("{0:0.000}", matrix[i][j]);
                    var spacesToAdd = spacesCount - numStr.Length;
                    str += numStr;
                    for (var k = 0; k < spacesToAdd; k++)
                    {
                        str += " ";
                    }
                }

                str += "|\n" + delimerLine + "\n";
            }

            Console.WriteLine(str);
        }

        static double[][] MatrixFromArrays(params double[][] arrays)
        {
            return arrays;
        }

        static double[] GenerateUnits(double[] arr)
        {
            var res = new double[arr.Length];
            for (var i = 0; i < arr.Length; i++)
            {
                res[i] = 1;
            }
            return res;
        }

        static double[][] MatrixMultiplication(double[][] matrixA, double[][] matrixB)
        {
            if (matrixA.Length != matrixB[0].Length)
            {
                throw new Exception("Умножение не возможно! Количество столбцов первой матрицы не равно количеству строк второй матрицы.");
            }

            var matrixC = new double[matrixB.Length][];


            for (var i = 0; i < matrixB.Length; i++)
            {
                matrixC[i] = new double[matrixA[0].Length];

                for (var j = 0; j < matrixA[0].Length; j++)
                {
                    for (var k = 0; k < matrixA.Length; k++)
                    {
                        var val1 = matrixA[k][j];
                        var val2 = matrixB[i][k];
                        matrixC[i][j] += val1 * val2;
                    }
                }
            }

            return matrixC;
        }


        static double[][] TransposeMatrix(double[][] matrix)
        {
            var trans = new double[matrix[0].Length][];
            for (int i = 0; i < matrix[0].Length; i++)
            {
                trans[i] = new double[matrix.Length];
                for (int j = 0; j < matrix.Length; j++)
                {
                    trans[i][j] = matrix[j][i];
                }
            }
            return trans;
        }

        static double[] Log10(double[] arr)
        {
            var res = new double[arr.Length];
            for (var i = 0; i < arr.Length; i++)
            {
                res[i] = Math.Log10(arr[i]);
            }
            return res;
        }

        static decimal[] ComputePredictions(this MultipleLinearRegression mlr, decimal[][] inputs)
        {
            var length = inputs[0].Length;
            var res = new decimal[length];
            for (int i = 0; i < length; i++)
            {
                var y = mlr.Coefs[0];
                for (var j = 1; j < mlr.Coefs.Length; j++)
                {
                    y += mlr.Coefs[j] * inputs[j - 1][i];
                }
                res[i] = y;
            }
            return res;
        }

        static decimal[] ComputeLeavings(decimal[] y, decimal[] predictions)
        {
            var length = y.Length;
            var res = new decimal[length];
            for (int i = 0; i < length; i++)
            {
                res[i] = y[i] - predictions[i];
            }
            return res;
        }

    }
}
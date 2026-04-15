#!/usr/bin/env python3
"""
CSV Merger Script

This script merges multiple CSV files into a single CSV file.
It assumes all CSV files have the same column structure.
If columns differ, it will merge based on available columns.

Usage:
    python merge_csv.py output.csv input1.csv input2.csv [input3.csv ...]

Or to merge all CSV files in a directory:
    python merge_csv.py output.csv /path/to/directory

Requirements:
    pip install pandas
"""

import pandas as pd
import sys
import os
import glob

def merge_csv_files(output_file, input_files):
    """
    Merge multiple CSV files into one.

    Args:
        output_file (str): Path to the output CSV file
        input_files (list): List of paths to input CSV files
    """
    if not input_files:
        print("Error: No input files provided")
        return

    # Read all CSV files
    dataframes = []
    for file_path in input_files:
        if os.path.exists(file_path):
            try:
                df = pd.read_csv(file_path, skiprows=1, on_bad_lines='skip')
                dataframes.append(df)
                print(f"Loaded {file_path} with {len(df)} rows")
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
        else:
            print(f"Warning: {file_path} does not exist")

    if not dataframes:
        print("Error: No valid CSV files found")
        return

    print(f"Merging {len(dataframes)} dataframes...")
    # Merge all dataframes
    merged_df = pd.concat(dataframes, ignore_index=True, sort=False)

    # Remove duplicate rows if they exist (optional)
    initial_rows = len(merged_df)
    merged_df = merged_df.drop_duplicates()
    final_rows = len(merged_df)

    if initial_rows != final_rows:
        print(f"Removed {initial_rows - final_rows} duplicate rows")

    # Save to output file
    merged_df.to_csv(output_file, index=False)
    print(f"Merged data saved to {output_file}")
    print(f"Total rows: {final_rows}")
    print(f"Columns: {list(merged_df.columns)}")

def get_csv_files_from_directory(directory):
    """
    Get all CSV files from a directory.

    Args:
        directory (str): Path to directory

    Returns:
        list: List of CSV file paths
    """
    if not os.path.isdir(directory):
        return [directory]  # Treat as single file

    csv_files = glob.glob(os.path.join(directory, "*.csv"))
    return sorted(csv_files)

def main():
    if len(sys.argv) < 3:
        print("Usage: python merge_csv.py <output.csv> <input1.csv> [input2.csv ...]")
        print("Or: python merge_csv.py <output.csv> <directory>")
        sys.exit(1)

    output_file = sys.argv[1]
    input_paths = sys.argv[2:]

    # Check if any input is a directory
    all_files = []
    for path in input_paths:
        if os.path.isdir(path):
            csv_files = get_csv_files_from_directory(path)
            all_files.extend(csv_files)
            print(f"Found {len(csv_files)} CSV files in {path}")
        else:
            all_files.append(path)

    merge_csv_files(output_file, all_files)

if __name__ == "__main__":
    main()
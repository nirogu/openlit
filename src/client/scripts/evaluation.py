import sys

def main():
    if len(sys.argv) < 3:
        print("Error: Missing arguments")
        return

    param1 = sys.argv[1]
    param2 = sys.argv[2]

    # Example processing
    result = f"Received {param1} and {param2}"
    
    print(result)  # This will be captured by Next.js API response

if __name__ == "__main__":
    main()

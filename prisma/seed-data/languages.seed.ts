export const languageData = [
    // Two Sum - Python
    {
        taskTemplateId: 'task_template_two_sum_001',
        language: 'python',
        stub: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    pass

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    nums = list(map(int, _lines[0].split()))
    target = int(_lines[1])
    result = two_sum(nums, target)
    print(' '.join(str(x) for x in result))`,
        solution: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    nums = list(map(int, _lines[0].split()))
    target = int(_lines[1])
    result = two_sum(nums, target)
    print(' '.join(str(x) for x in result))`,
    },
    // Two Sum - JavaScript
    {
        taskTemplateId: 'task_template_two_sum_001',
        language: 'javascript',
        stub: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums = _lines[0].split(' ').map(Number);
const target = Number(_lines[1]);
const result = twoSum(nums, target);
console.log(result.join(' '));`,
        solution: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums = _lines[0].split(' ').map(Number);
const target = Number(_lines[1]);
const result = twoSum(nums, target);
console.log(result.join(' '));`,
    },
    // Two Sum - TypeScript
    {
        taskTemplateId: 'task_template_two_sum_001',
        language: 'typescript',
        stub: `function twoSum(nums: number[], target: number): number[] {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums: number[] = _lines[0].split(' ').map(Number);
const target: number = Number(_lines[1]);
const result = twoSum(nums, target);
console.log(result.join(' '));`,
        solution: `function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement)!, i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums: number[] = _lines[0].split(' ').map(Number);
const target: number = Number(_lines[1]);
const result = twoSum(nums, target);
console.log(result.join(' '));`,
    },

    // Reverse String - Python
    {
        taskTemplateId: 'task_template_reverse_string_001',
        language: 'python',
        stub: `def reverse_string(s):
    """
    :type s: List[str]
    :rtype: None Do not return anything, modify s in-place instead.
    """
    pass

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    s = _lines[0].split()
    reverse_string(s)
    print(' '.join(s))`,
        solution: `def reverse_string(s):
    """
    :type s: List[str]
    :rtype: None Do not return anything, modify s in-place instead.
    """
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    s = _lines[0].split()
    reverse_string(s)
    print(' '.join(s))`,
    },
    // Reverse String - JavaScript
    {
        taskTemplateId: 'task_template_reverse_string_001',
        language: 'javascript',
        stub: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s = _lines[0].split(' ');
reverseString(s);
console.log(s.join(' '));`,
        solution: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s = _lines[0].split(' ');
reverseString(s);
console.log(s.join(' '));`,
    },
    // Reverse String - TypeScript
    {
        taskTemplateId: 'task_template_reverse_string_001',
        language: 'typescript',
        stub: `function reverseString(s: string[]): void {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s: string[] = _lines[0].split(' ');
reverseString(s);
console.log(s.join(' '));`,
        solution: `function reverseString(s: string[]): void {
    let left = 0, right = s.length - 1;
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s: string[] = _lines[0].split(' ');
reverseString(s);
console.log(s.join(' '));`,
    },

    // Valid Palindrome - Python
    {
        taskTemplateId: 'task_template_palindrome_001',
        language: 'python',
        stub: `def is_palindrome(s):
    """
    :type s: str
    :rtype: bool
    """
    pass

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    s = _lines[0]
    result = is_palindrome(s)
    print(str(result).lower())`,
        solution: `def is_palindrome(s):
    """
    :type s: str
    :rtype: bool
    """
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    s = _lines[0]
    result = is_palindrome(s)
    print(str(result).lower())`,
    },
    // Valid Palindrome - JavaScript
    {
        taskTemplateId: 'task_template_palindrome_001',
        language: 'javascript',
        stub: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s = _lines[0];
const result = isPalindrome(s);
console.log(JSON.stringify(result));`,
        solution: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s = _lines[0];
const result = isPalindrome(s);
console.log(JSON.stringify(result));`,
    },
    // Valid Palindrome - TypeScript
    {
        taskTemplateId: 'task_template_palindrome_001',
        language: 'typescript',
        stub: `function isPalindrome(s: string): boolean {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s: string = _lines[0];
const result = isPalindrome(s);
console.log(JSON.stringify(result));`,
        solution: `function isPalindrome(s: string): boolean {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s: string = _lines[0];
const result = isPalindrome(s);
console.log(JSON.stringify(result));`,
    },

    // FizzBuzz - Python
    {
        taskTemplateId: 'task_template_fizzbuzz_001',
        language: 'python',
        stub: `def fizzbuzz(n: int) -> str:
    pass

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    n = int(_lines[0])
    result = fizzbuzz(n)
    print(result)`,
        solution: `def fizzbuzz(n: int) -> str:
    if n % 15 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    else:
        return str(n)

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    n = int(_lines[0])
    result = fizzbuzz(n)
    print(result)`,
    },
    // FizzBuzz - JavaScript
    {
        taskTemplateId: 'task_template_fizzbuzz_001',
        language: 'javascript',
        stub: `/**
 * @param {number} n
 * @return {string}
 */
function fizzBuzz(n) {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const n = Number(_lines[0]);
const result = fizzBuzz(n);
console.log(result);`,
        solution: `/**
 * @param {number} n
 * @return {string}
 */
function fizzBuzz(n) {
    if (n % 15 === 0) return 'FizzBuzz';
    if (n % 3 === 0) return 'Fizz';
    if (n % 5 === 0) return 'Buzz';
    return String(n);
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const n = Number(_lines[0]);
const result = fizzBuzz(n);
console.log(result);`,
    },
    // FizzBuzz - TypeScript
    {
        taskTemplateId: 'task_template_fizzbuzz_001',
        language: 'typescript',
        stub: `function fizzBuzz(n: number): string {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const n: number = Number(_lines[0]);
const result = fizzBuzz(n);
console.log(result);`,
        solution: `function fizzBuzz(n: number): string {
    if (n % 15 === 0) return 'FizzBuzz';
    if (n % 3 === 0) return 'Fizz';
    if (n % 5 === 0) return 'Buzz';
    return String(n);
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const n: number = Number(_lines[0]);
const result = fizzBuzz(n);
console.log(result);`,
    },

    // Quick Warmup - Python
    {
        taskTemplateId: 'task_template_quick_warmup_001',
        language: 'python',
        stub: `# Write your code here
`,
        solution: `# Sample solution
print("Hello, World!")`,
    },
    // Quick Warmup - JavaScript
    {
        taskTemplateId: 'task_template_quick_warmup_001',
        language: 'javascript',
        stub: `// Write your code here
`,
        solution: `// Sample solution
console.log("Hello, World!");`,
    },
    // Quick Warmup - TypeScript
    {
        taskTemplateId: 'task_template_quick_warmup_001',
        language: 'typescript',
        stub: `// Write your code here
`,
        solution: `// Sample solution
console.log("Hello, World!");`,
    },

    // Maximum Subarray - Python
    {
        taskTemplateId: 'task_template_max_subarray_001',
        language: 'python',
        stub: `def max_subarray(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    pass

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    nums = list(map(int, _lines[0].split()))
    result = max_subarray(nums)
    print(result)`,
        solution: `def max_subarray(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    max_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    nums = list(map(int, _lines[0].split()))
    result = max_subarray(nums)
    print(result)`,
    },
    // Maximum Subarray - JavaScript
    {
        taskTemplateId: 'task_template_max_subarray_001',
        language: 'javascript',
        stub: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums = _lines[0].split(' ').map(Number);
const result = maxSubArray(nums);
console.log(result);`,
        solution: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];

    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums = _lines[0].split(' ').map(Number);
const result = maxSubArray(nums);
console.log(result);`,
    },
    // Maximum Subarray - TypeScript
    {
        taskTemplateId: 'task_template_max_subarray_001',
        language: 'typescript',
        stub: `function maxSubArray(nums: number[]): number {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums: number[] = _lines[0].split(' ').map(Number);
const result = maxSubArray(nums);
console.log(result);`,
        solution: `function maxSubArray(nums: number[]): number {
    let maxSum = nums[0];
    let currentSum = nums[0];

    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums: number[] = _lines[0].split(' ').map(Number);
const result = maxSubArray(nums);
console.log(result);`,
    },

    // Binary Search - Python
    {
        taskTemplateId: 'task_template_binary_search_001',
        language: 'python',
        stub: `def search(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    pass

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    nums = list(map(int, _lines[0].split()))
    target = int(_lines[1])
    result = search(nums, target)
    print(result)`,
        solution: `def search(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    nums = list(map(int, _lines[0].split()))
    target = int(_lines[1])
    result = search(nums, target)
    print(result)`,
    },
    // Binary Search - JavaScript
    {
        taskTemplateId: 'task_template_binary_search_001',
        language: 'javascript',
        stub: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums = _lines[0].split(' ').map(Number);
const target = Number(_lines[1]);
const result = search(nums, target);
console.log(result);`,
        solution: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
    let left = 0, right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums = _lines[0].split(' ').map(Number);
const target = Number(_lines[1]);
const result = search(nums, target);
console.log(result);`,
    },
    // Binary Search - TypeScript
    {
        taskTemplateId: 'task_template_binary_search_001',
        language: 'typescript',
        stub: `function search(nums: number[], target: number): number {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums: number[] = _lines[0].split(' ').map(Number);
const target: number = Number(_lines[1]);
const result = search(nums, target);
console.log(result);`,
        solution: `function search(nums: number[], target: number): number {
    let left = 0, right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const nums: number[] = _lines[0].split(' ').map(Number);
const target: number = Number(_lines[1]);
const result = search(nums, target);
console.log(result);`,
    },

    // Valid Parentheses - Python
    {
        taskTemplateId: 'task_template_valid_parentheses_001',
        language: 'python',
        stub: `def is_valid(s):
    """
    :type s: str
    :rtype: bool
    """
    pass

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    s = _lines[0]
    result = is_valid(s)
    print(str(result).lower())`,
        solution: `def is_valid(s):
    """
    :type s: str
    :rtype: bool
    """
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)

    return not stack

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    s = _lines[0]
    result = is_valid(s)
    print(str(result).lower())`,
    },
    // Valid Parentheses - JavaScript
    {
        taskTemplateId: 'task_template_valid_parentheses_001',
        language: 'javascript',
        stub: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s = _lines[0];
const result = isValid(s);
console.log(JSON.stringify(result));`,
        solution: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    const stack = [];
    const mapping = { ')': '(', '}': '{', ']': '[' };

    for (const char of s) {
        if (char in mapping) {
            const topElement = stack.length > 0 ? stack.pop() : '#';
            if (mapping[char] !== topElement) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }

    return stack.length === 0;
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s = _lines[0];
const result = isValid(s);
console.log(JSON.stringify(result));`,
    },
    // Valid Parentheses - TypeScript
    {
        taskTemplateId: 'task_template_valid_parentheses_001',
        language: 'typescript',
        stub: `function isValid(s: string): boolean {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s: string = _lines[0];
const result = isValid(s);
console.log(JSON.stringify(result));`,
        solution: `function isValid(s: string): boolean {
    const stack: string[] = [];
    const mapping: Record<string, string> = { ')': '(', '}': '{', ']': '[' };

    for (const char of s) {
        if (char in mapping) {
            const topElement = stack.length > 0 ? stack.pop()! : '#';
            if (mapping[char] !== topElement) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }

    return stack.length === 0;
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const s: string = _lines[0];
const result = isValid(s);
console.log(JSON.stringify(result));`,
    },

    // Merge Two Sorted Lists - Python
    {
        taskTemplateId: 'task_template_merge_sorted_001',
        language: 'python',
        stub: `def merge_two_lists(list1, list2):
    """
    :type list1: List[int]
    :type list2: List[int]
    :rtype: List[int]
    """
    pass

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    list1 = list(map(int, _lines[0].split())) if _lines[0].strip() else []
    list2 = list(map(int, _lines[1].split())) if _lines[1].strip() else []
    result = merge_two_lists(list1, list2)
    print(' '.join(str(x) for x in result))`,
        solution: `def merge_two_lists(list1, list2):
    """
    :type list1: List[int]
    :type list2: List[int]
    :rtype: List[int]
    """
    result = []
    i, j = 0, 0

    while i < len(list1) and j < len(list2):
        if list1[i] <= list2[j]:
            result.append(list1[i])
            i += 1
        else:
            result.append(list2[j])
            j += 1

    result.extend(list1[i:])
    result.extend(list2[j:])

    return result

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    list1 = list(map(int, _lines[0].split())) if _lines[0].strip() else []
    list2 = list(map(int, _lines[1].split())) if _lines[1].strip() else []
    result = merge_two_lists(list1, list2)
    print(' '.join(str(x) for x in result))`,
    },
    // Merge Two Sorted Lists - JavaScript
    {
        taskTemplateId: 'task_template_merge_sorted_001',
        language: 'javascript',
        stub: `/**
 * @param {number[]} list1
 * @param {number[]} list2
 * @return {number[]}
 */
function mergeTwoLists(list1, list2) {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const list1 = _lines[0].trim() ? _lines[0].split(' ').map(Number) : [];
const list2 = _lines[1].trim() ? _lines[1].split(' ').map(Number) : [];
const result = mergeTwoLists(list1, list2);
console.log(result.join(' '));`,
        solution: `/**
 * @param {number[]} list1
 * @param {number[]} list2
 * @return {number[]}
 */
function mergeTwoLists(list1, list2) {
    const result = [];
    let i = 0, j = 0;

    while (i < list1.length && j < list2.length) {
        if (list1[i] <= list2[j]) {
            result.push(list1[i]);
            i++;
        } else {
            result.push(list2[j]);
            j++;
        }
    }

    return result.concat(list1.slice(i)).concat(list2.slice(j));
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const list1 = _lines[0].trim() ? _lines[0].split(' ').map(Number) : [];
const list2 = _lines[1].trim() ? _lines[1].split(' ').map(Number) : [];
const result = mergeTwoLists(list1, list2);
console.log(result.join(' '));`,
    },
    // Merge Two Sorted Lists - TypeScript
    {
        taskTemplateId: 'task_template_merge_sorted_001',
        language: 'typescript',
        stub: `function mergeTwoLists(list1: number[], list2: number[]): number[] {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const list1: number[] = _lines[0].trim() ? _lines[0].split(' ').map(Number) : [];
const list2: number[] = _lines[1].trim() ? _lines[1].split(' ').map(Number) : [];
const result = mergeTwoLists(list1, list2);
console.log(result.join(' '));`,
        solution: `function mergeTwoLists(list1: number[], list2: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;

    while (i < list1.length && j < list2.length) {
        if (list1[i] <= list2[j]) {
            result.push(list1[i]);
            i++;
        } else {
            result.push(list2[j]);
            j++;
        }
    }

    return result.concat(list1.slice(i)).concat(list2.slice(j));
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const list1: number[] = _lines[0].trim() ? _lines[0].split(' ').map(Number) : [];
const list2: number[] = _lines[1].trim() ? _lines[1].split(' ').map(Number) : [];
const result = mergeTwoLists(list1, list2);
console.log(result.join(' '));`,
    },

    // Longest Common Prefix - Python
    {
        taskTemplateId: 'task_template_longest_prefix_001',
        language: 'python',
        stub: `def longest_common_prefix(strs):
    """
    :type strs: List[str]
    :rtype: str
    """
    pass

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    strs = _lines[0].split()
    result = longest_common_prefix(strs)
    print(result)`,
        solution: `def longest_common_prefix(strs):
    """
    :type strs: List[str]
    :rtype: str
    """
    if not strs:
        return ""

    prefix = strs[0]
    for string in strs[1:]:
        while not string.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""

    return prefix

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    strs = _lines[0].split()
    result = longest_common_prefix(strs)
    print(result)`,
    },
    // Longest Common Prefix - JavaScript
    {
        taskTemplateId: 'task_template_longest_prefix_001',
        language: 'javascript',
        stub: `/**
 * @param {string[]} strs
 * @return {string}
 */
function longestCommonPrefix(strs) {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const strs = _lines[0].split(' ');
const result = longestCommonPrefix(strs);
console.log(result);`,
        solution: `/**
 * @param {string[]} strs
 * @return {string}
 */
function longestCommonPrefix(strs) {
    if (strs.length === 0) return "";

    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (!strs[i].startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
            if (prefix === "") return "";
        }
    }

    return prefix;
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const strs = _lines[0].split(' ');
const result = longestCommonPrefix(strs);
console.log(result);`,
    },
    // Longest Common Prefix - TypeScript
    {
        taskTemplateId: 'task_template_longest_prefix_001',
        language: 'typescript',
        stub: `function longestCommonPrefix(strs: string[]): string {
    // Your code here
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const strs: string[] = _lines[0].split(' ');
const result = longestCommonPrefix(strs);
console.log(result);`,
        solution: `function longestCommonPrefix(strs: string[]): string {
    if (strs.length === 0) return "";

    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (!strs[i].startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
            if (prefix === "") return "";
        }
    }

    return prefix;
}

// Do not edit below
const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
const strs: string[] = _lines[0].split(' ');
const result = longestCommonPrefix(strs);
console.log(result);`,
    },
];

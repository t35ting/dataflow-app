-- DataFlow Database Initialization Script
-- This script creates the necessary tables for the DataFlow application

-- Create the problems table
CREATE TABLE IF NOT EXISTS problems (
    id VARCHAR PRIMARY KEY,
    title TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    link TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Not Prepared',
    notes TEXT DEFAULT '',
    slug TEXT NOT NULL,
    search_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_from_csv BOOLEAN DEFAULT FALSE,
    deleted BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_status ON problems(status);
CREATE INDEX IF NOT EXISTS idx_problems_tags ON problems USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_problems_search_text ON problems USING GIN(to_tsvector('english', search_text));
CREATE INDEX IF NOT EXISTS idx_problems_created_at ON problems(created_at);
CREATE INDEX IF NOT EXISTS idx_problems_updated_at ON problems(updated_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_problems_updated_at ON problems;
CREATE TRIGGER update_problems_updated_at
    BEFORE UPDATE ON problems
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO problems (id, title, difficulty, tags, link, slug, search_text) VALUES
('1', 'Two Sum', 'Easy', ARRAY['Array', 'Hash Table'], 'https://leetcode.com/problems/two-sum/', 'two-sum', 'two sum array hash table'),
('2', 'Add Two Numbers', 'Medium', ARRAY['Linked List', 'Math'], 'https://leetcode.com/problems/add-two-numbers/', 'add-two-numbers', 'add two numbers linked list math'),
('3', 'Longest Substring Without Repeating Characters', 'Medium', ARRAY['Hash Table', 'String', 'Sliding Window'], 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 'longest-substring-without-repeating-characters', 'longest substring without repeating characters hash table string sliding window')
ON CONFLICT (id) DO NOTHING;

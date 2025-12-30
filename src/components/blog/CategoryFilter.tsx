import React from 'react'
import { Badge } from '../ui/Badge'

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'React', label: 'React' },
  { id: 'TypeScript', label: 'TypeScript' },
  { id: 'Tailwind', label: 'Tailwind CSS' },
  { id: 'JavaScript', label: 'JavaScript' },
  { id: 'Web Development', label: 'Web Dev' },
]

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className="focus:outline-none"
        >
          <Badge
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/20 transition-colors"
          >
            {category.label}
          </Badge>
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
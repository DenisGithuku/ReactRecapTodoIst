const FilterComponent = ({ selectedCategory, onChangeCategory }) => {
  return (
    <div className="filter-component">
      <span>{selectedCategory}</span>
      <ul className="categories">
        <li onClick={() => {
            onChangeCategory("all")
        }}>
          <span>All</span>
        </li>
        <li onClick={() => {
            onChangeCategory("completed")
        }}>
          <span>Completed</span>
        </li>
        <li onClick={() => {
            onChangeCategory("pending")
        }}>
          <span>Pending</span>
        </li>
      </ul>
    </div>
  );
};

export default FilterComponent;

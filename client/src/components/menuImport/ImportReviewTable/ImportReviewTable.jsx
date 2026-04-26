import PropTypes from 'prop-types';
import Checkbox from '../../common/Checkbox/Checkbox';
import AllergenPicker from '../../common/AllergenPicker';
import { useAllergens } from '../../../hooks/useAllergens';
import { matchParserSuggestionsToAllergenIds } from '../../../utils/matchParserSuggestionsToAllergenIds';
import './ImportReviewTable.scss';

function statusLabel(status) {
	if (status === 'valid') return 'OK';
	if (status === 'invalid') return 'Fix';
	return 'Duplicate';
}

function statusClass(status) {
	if (status === 'valid') return 'import-review__badge--ok';
	if (status === 'invalid') return 'import-review__badge--bad';
	return 'import-review__badge--dup';
}

/**
 * @param {object} props
 * @param {Array} props.rows
 * @param {function} props.onToggleSelect
 * @param {function} props.onFieldChange
 * @param {function} props.onAllergenIdsChange
 */
function ImportReviewTable({
	rows,
	onToggleSelect,
	onFieldChange,
	onAllergenIdsChange,
}) {
	const allergens = useAllergens();
	const rowsWithSuggestions = rows.filter(
		(row) => (row.item.possible_allergens || []).length > 0,
	).length;
	const hasAnySuggestions = rowsWithSuggestions > 0;

	const applyAllSuggestionMatches = () => {
		rows.forEach((row) => {
			const sug = row.item.possible_allergens || [];
			if (sug.length === 0) return;
			const ids = matchParserSuggestionsToAllergenIds(sug, allergens);
			const merged = [...new Set([...(row.selectedAllergenIds || []), ...ids])];
			onAllergenIdsChange(row.clientKey, merged);
		});
	};

	return (
		<div className="import-review">
			<div className="import-review__top-actions">
				<p className="import-review__top-help">
					{hasAnySuggestions
						? `${rowsWithSuggestions} item(s) have parser allergen suggestions.`
						: 'No parser allergen suggestions were detected for this import.'}
				</p>
				<button
					type="button"
					className="import-review__ghost-btn import-review__ghost-btn--top"
					onClick={applyAllSuggestionMatches}
					disabled={!hasAnySuggestions}
				>
					Match suggestions to allergen checkboxes (all items)
				</button>
			</div>
			{rows.map((row) => {
				const sug = row.item.possible_allergens || [];
				const canPrefill = sug.length > 0;

				const applySuggestionMatches = () => {
					const ids = matchParserSuggestionsToAllergenIds(sug, allergens);
					const merged = [...new Set([...(row.selectedAllergenIds || []), ...ids])];
					onAllergenIdsChange(row.clientKey, merged);
				};

				return (
					<article
						key={row.clientKey}
						className={`import-review__card${
							row.selected ? '' : ' import-review__card--inactive'
						}`}
					>
						<header className="import-review__card-head">
							<div className="import-review__card-head-left">
								<Checkbox
									label="Include in save"
									isSelected={row.selected}
									onChange={() => onToggleSelect(row.clientKey)}
									size="small"
								/>
								<span
									className={`import-review__badge ${statusClass(row.sourceStatus)}`}
								>
									{statusLabel(row.sourceStatus)}
								</span>
							</div>
						</header>

						<div className="import-review__grid">
							<label className="import-review__field import-review__field--span2">
								<span className="import-review__label">Name</span>
								<input
									type="text"
									className="import-review__input"
									value={row.item.name}
									onChange={(e) =>
										onFieldChange(row.clientKey, 'name', e.target.value)
									}
									aria-label="Item name"
								/>
								{row.rowIssues && row.rowIssues.length > 0 && (
									<div className="import-review__issues" role="status">
										{row.rowIssues.map((iss) => (
											<span key={iss.code || iss.message}>{iss.message}</span>
										))}
									</div>
								)}
							</label>

							<label className="import-review__field">
								<span className="import-review__label">Price</span>
								<input
									type="text"
									className="import-review__input import-review__input--price"
									value={
										row.item.price == null ? '' : String(row.item.price)
									}
									onChange={(e) => {
										const v = e.target.value.trim();
										onFieldChange(row.clientKey, 'price', v === '' ? null : v);
									}}
									aria-label="Price"
								/>
							</label>

							<label className="import-review__field">
								<span className="import-review__label">Category</span>
								<input
									type="text"
									className="import-review__input"
									value={row.item.category || ''}
									onChange={(e) =>
										onFieldChange(row.clientKey, 'category', e.target.value)
									}
									aria-label="Category"
								/>
							</label>

							<label className="import-review__field import-review__field--span2">
								<span className="import-review__label">Description</span>
								<textarea
									className="import-review__textarea"
									rows={3}
									value={row.item.description || ''}
									onChange={(e) =>
										onFieldChange(
											row.clientKey,
											'description',
											e.target.value,
										)
									}
									aria-label="Description"
								/>
							</label>

							<label className="import-review__field import-review__field--span2">
								<span className="import-review__label">
									Ingredients (comma-separated)
								</span>
								<textarea
									className="import-review__textarea"
									rows={3}
									value={
										Array.isArray(row.item.ingredients)
											? row.item.ingredients.join(', ')
											: row.item.ingredients || ''
									}
									onChange={(e) => {
										const parts = e.target.value
											.split(',')
											.map((s) => s.trim())
											.filter(Boolean);
										onFieldChange(row.clientKey, 'ingredients', parts);
									}}
									aria-label="Ingredients, comma separated"
								/>
							</label>
						</div>

						<section className="import-review__allergens" aria-label="Allergens">
							<h3 className="import-review__section-title">Allergens</h3>
							<p className="import-review__hint">
								Parser suggestions are hints only. Nothing is stored until you pick
								database allergens and confirm below. Use “Match suggestions” to
								pre-fill checkboxes from the parser text, then review and adjust.
							</p>
							{sug.length > 0 && (
								<div className="import-review__suggestions">
									<span className="import-review__suggestions-label">
										Parser suggestions (untrusted)
									</span>
									<span className="import-review__suggestions-tags">
										{sug.join(', ')}
									</span>
									{canPrefill && (
										<button
											type="button"
											className="import-review__ghost-btn"
											onClick={applySuggestionMatches}
										>
											Match suggestions to checkboxes
										</button>
									)}
								</div>
							)}
							<div className="import-review__picker-wrap">
								<AllergenPicker
									selectedAllergens={row.selectedAllergenIds}
									onChange={(ids) => onAllergenIdsChange(row.clientKey, ids)}
									compact
								/>
							</div>
						</section>
					</article>
				);
			})}
		</div>
	);
}

ImportReviewTable.propTypes = {
	rows: PropTypes.arrayOf(PropTypes.object).isRequired,
	onToggleSelect: PropTypes.func.isRequired,
	onFieldChange: PropTypes.func.isRequired,
	onAllergenIdsChange: PropTypes.func.isRequired,
};

export default ImportReviewTable;

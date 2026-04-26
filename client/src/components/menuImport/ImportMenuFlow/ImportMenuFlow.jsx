import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../api';
import { useToast } from '../../../context/ToastContext';
import ImportReviewTable from '../ImportReviewTable/ImportReviewTable';
import './ImportMenuFlow.scss';

function isPlaceholderMenuId(id, bid) {
	if (!id || !bid) return false;
	return String(id) === `menu_${bid}`;
}

function makeClientKey() {
	if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
		return `row_${window.crypto.randomUUID()}`;
	}
	return `row_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function buildReviewRowsFromParseItems(items) {
	if (!Array.isArray(items)) return [];
	return items.map((entry) => {
		const item = entry.item || {};
		return {
			clientKey: makeClientKey(),
			sourceStatus: entry.status,
			rowIssues: entry.issues || [],
			selected: entry.status === 'valid',
			item: {
				name: item.name != null ? String(item.name) : '',
				description: item.description != null ? String(item.description) : '',
				ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
				price: item.price == null || item.price === '' ? null : item.price,
				category: item.category != null ? String(item.category) : 'Uncategorized',
				possible_allergens: Array.isArray(item.possible_allergens)
					? item.possible_allergens
					: [],
			},
			selectedAllergenIds: [],
			allergenAcknowledged: false,
		};
	});
}

function canSaveRow(row) {
	if (!row.selected) return true;
	if (!row.item.name || !String(row.item.name).trim()) return false;
	const sug = row.item.possible_allergens || [];
	if (sug.length > 0 && !row.allergenAcknowledged) return false;
	return true;
}

function defaultImportApi() {
	return api.menuImport;
}

function normalizeImportError(errLike) {
	const code = errLike?.code || null;
	const fallback = errLike?.fallback || 'Upload a file instead, or add items manually.';
	const generic = errLike?.error || errLike?.message || 'Import failed.';
	const byCode = {
		IMPORT_ZERO_ITEMS_PARSED:
			'No menu items were found in that source. Try a cleaner section, CSV/DOCX, or manual entry.',
		IMPORT_EMPTY_EXTRACTED_TEXT:
			'No selectable text could be extracted. This often means a scanned/image-only PDF.',
		IMPORT_MIME_EXTENSION_MISMATCH:
			'The selected file format looks mismatched. Re-export the file and upload again.',
		IMPORT_TEXT_EXTRACTION_FAILED:
			'We could not read text from this file. Try CSV/DOCX, or manual entry.',
		IMPORT_PARSE_TIMEOUT:
			'Parsing took too long this time. Please retry, or use manual entry.',
		IMPORT_RATE_LIMITED:
			'Too many import requests were sent quickly. Wait a minute and retry.',
	};
	return {
		code,
		error: byCode[code] || generic,
		fallback,
	};
}

function ImportMenuFlow({ menuImport: importApiProp } = {}) {
	const menuImport = importApiProp || defaultImportApi();
	const { showError, showSuccess } = useToast();
	const location = useLocation();
	const navigate = useNavigate();
	const fromState = location.state || {};

	const [step, setStep] = useState('ingest');
	const [ingestTab, setIngestTab] = useState('file');
	const [urlValue, setUrlValue] = useState('');
	const [ingestLoading, setIngestLoading] = useState(false);
	const [ingestStage, setIngestStage] = useState('');
	const [ingestError, setIngestError] = useState(null);
	const [parseInfo, setParseInfo] = useState(null);
	const [rows, setRows] = useState([]);

	const [saveLoading, setSaveLoading] = useState(false);
	const [saveResult, setSaveResult] = useState(null);

	const businessId =
		typeof localStorage !== 'undefined' ? localStorage.getItem('businessId') : '';
	const menuIdFromState = fromState.menuID;
	const rawMenuId =
		menuIdFromState
		|| (typeof localStorage !== 'undefined' && localStorage.getItem('currentMenuId'))
		|| '';

	const [resolvedMenuId, setResolvedMenuId] = useState(null);
	const [menuResolving, setMenuResolving] = useState(false);

	useEffect(() => {
		let cancelled = false;
		const bid =
			typeof localStorage !== 'undefined' ? localStorage.getItem('businessId') : '';
		if (!bid) {
			setResolvedMenuId(null);
			setMenuResolving(false);
			return;
		}

		const raw =
			menuIdFromState
			|| (typeof localStorage !== 'undefined' && localStorage.getItem('currentMenuId'))
			|| '';

		if (raw && !isPlaceholderMenuId(raw, bid)) {
			setResolvedMenuId(raw);
			setMenuResolving(false);
			return;
		}

		setMenuResolving(true);
		(async () => {
			try {
				let r = await api.menuItems.getMenuForBusiness(bid);
				if (cancelled) return;
				if (r.ok && r.data?.id) {
					setResolvedMenuId(r.data.id);
					if (typeof localStorage !== 'undefined') {
						localStorage.setItem('currentMenuId', r.data.id);
					}
					return;
				}
				const ens = await api.menus.ensureForBusiness(bid);
				if (cancelled) return;
				if (ens.ok && ens.data?.id) {
					setResolvedMenuId(ens.data.id);
					if (typeof localStorage !== 'undefined') {
						localStorage.setItem('currentMenuId', ens.data.id);
					}
				} else {
					setResolvedMenuId(null);
				}
			} finally {
				if (!cancelled) setMenuResolving(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [menuIdFromState]);

	const effectiveMenuId = useMemo(() => {
		if (resolvedMenuId) return resolvedMenuId;
		if (rawMenuId && businessId && !isPlaceholderMenuId(rawMenuId, businessId)) {
			return rawMenuId;
		}
		return '';
	}, [resolvedMenuId, rawMenuId, businessId]);

	const menuTitle = fromState.menuTitle || 'Your menu';

	const partialParse = parseInfo?.partial;

	const onFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		runFileImport(file);
	};

	const runFileImport = async (file) => {
		setIngestError(null);
		setIngestStage('Uploading file…');
		setIngestLoading(true);
		setTimeout(() => {
			setIngestStage((s) => (s ? 'Extracting text…' : s));
		}, 180);
		setTimeout(() => {
			setIngestStage((s) => (s ? 'Parsing items…' : s));
		}, 520);
		const result = await menuImport.importFile(file);
		setIngestLoading(false);
		setIngestStage('');
		if (!result.ok) {
			setIngestError(normalizeImportError({
				error: result.data?.error || result.message || 'Import failed',
				fallback: result.data?.fallback || 'Try another file or add items manually.',
				code: result.data?.code,
			}));
			return;
		}
		if (!result.data) {
			setIngestError(normalizeImportError({
				error: 'Import failed',
				fallback: 'Try another file or add items manually.',
			}));
			return;
		}
		if (!result.data.success) {
			setIngestError(normalizeImportError({
				error: result.data.error,
				fallback: result.data.fallback,
				code: result.data.code,
			}));
			return;
		}
		const nextRows = buildReviewRowsFromParseItems(result.data.items);
		setParseInfo({
			partial: result.data.partial,
			summary: result.data.summary,
			quality: result.data.quality || null,
		});
		setRows(nextRows);
		setStep('review');
	};

	const runUrlImport = async () => {
		const u = urlValue.trim();
		if (!u) {
			showError('Please enter a URL.');
			return;
		}
		setIngestError(null);
		setIngestStage('Fetching page…');
		setIngestLoading(true);
		setTimeout(() => {
			setIngestStage((s) => (s ? 'Extracting visible text…' : s));
		}, 220);
		setTimeout(() => {
			setIngestStage((s) => (s ? 'Parsing items…' : s));
		}, 620);
		const result = await menuImport.importUrl(u);
		setIngestLoading(false);
		setIngestStage('');
		if (!result.ok) {
			setIngestError(normalizeImportError({
				error: result.data?.error || result.message || 'Request failed',
				fallback: result.data?.fallback || 'Upload a file instead, or add items manually.',
				code: result.data?.code,
			}));
			return;
		}
		if (!result.data) {
			setIngestError(normalizeImportError({
				error: 'Request failed',
				fallback: 'Upload a file instead, or add items manually.',
			}));
			return;
		}
		if (!result.data.success) {
			setIngestError(normalizeImportError({
				error: result.data.error,
				fallback: result.data.fallback,
				code: result.data.code,
			}));
			return;
		}
		const nextRows = buildReviewRowsFromParseItems(result.data.items);
		setParseInfo({
			partial: result.data.partial,
			summary: result.data.summary,
			quality: result.data.quality || null,
		});
		setRows(nextRows);
		setStep('review');
	};

	const goManual = () => {
		navigate('/add-menu-item', {
			state: { menuID: effectiveMenuId || rawMenuId || '', menuTitle },
		});
	};

	const toggleSelect = useCallback((clientKey) => {
		setRows((prev) =>
			prev.map((r) =>
				r.clientKey === clientKey ? { ...r, selected: !r.selected } : r,
			),
		);
	}, []);

	const onFieldChange = useCallback((clientKey, field, value) => {
		setRows((prev) =>
			prev.map((r) => {
				if (r.clientKey !== clientKey) return r;
				if (field === 'price') {
					let p = null;
					if (value !== null && value !== '') {
						const n = Number(value);
						p = Number.isNaN(n) ? r.item.price : n;
					}
					return {
						...r,
						item: { ...r.item, price: p },
					};
				}
				return {
					...r,
					item: { ...r.item, [field]: value },
				};
			}),
		);
	}, []);

	const onAllergenIds = useCallback((clientKey, ids) => {
		setRows((prev) =>
			prev.map((r) =>
				r.clientKey === clientKey
					? { ...r, selectedAllergenIds: ids }
					: r,
			),
		);
	}, []);

	const onAllergenAck = useCallback((clientKey, next) => {
		setRows((prev) =>
			prev.map((r) =>
				r.clientKey === clientKey
					? { ...r, allergenAcknowledged: next }
					: r,
			),
		);
	}, []);

	const canSubmitSave = useMemo(() => {
		if (!effectiveMenuId) return false;
		const selected = rows.filter((r) => r.selected);
		if (selected.length === 0) return false;
		return selected.every((r) => canSaveRow(r));
	}, [rows, effectiveMenuId]);

	const handleSave = async () => {
		if (!canSubmitSave) return;
		if (!String(effectiveMenuId).trim()) {
			showError('No valid target menu. Open this page from your menu, then try again.');
			return;
		}
		const selected = rows.filter((r) => r.selected);
		const idempotencyKey =
			typeof window !== 'undefined' && window.crypto?.randomUUID
				? window.crypto.randomUUID()
				: `idem_${Date.now()}_${Math.random()}`;

		const items = selected.map((r) => {
			const suggested = r.item.possible_allergens || [];
			return {
				client_key: r.clientKey,
				name: r.item.name,
				description: r.item.description || '',
				ingredients: r.item.ingredients,
				category: r.item.category,
				price: r.item.price,
				suggested_allergens: suggested,
				allergens: r.selectedAllergenIds,
				allergen_import_acknowledged:
					suggested.length === 0 || r.allergenAcknowledged,
			};
		});

		setSaveLoading(true);
		const result = await menuImport.saveImportedItems(
			{ menu_id: effectiveMenuId, items },
			idempotencyKey,
		);
		setSaveLoading(false);
		if (!result.ok || !result.data) {
			showError(result.message || 'Save failed.');
			return;
		}
		if (result.data.success) {
			if (typeof localStorage !== 'undefined' && effectiveMenuId) {
				localStorage.setItem('currentMenuId', effectiveMenuId);
			}
			setSaveResult(result.data);
			if (result.data.summary?.failed) {
				showError(
					`Saved ${result.data.summary.saved} item(s); ${result.data.summary.failed} failed. Review results below.`,
				);
			} else {
				showSuccess('Items saved to your menu.');
			}
			setStep('result');
		} else {
			showError(result.data.error || 'Save failed.');
		}
	};

	const backToIngest = () => {
		setStep('ingest');
		setParseInfo(null);
		setRows([]);
		setSaveResult(null);
		setIngestError(null);
		setIngestStage('');
	};

	if (step === 'result' && saveResult) {
		const savedCount = saveResult.summary?.saved ?? 0;
		const failedCount = saveResult.summary?.failed ?? 0;
		return (
			<div className="import-flow">
				<div className="import-flow__panel" aria-busy={saveLoading}>
					<h1 className="import-flow__title">Import result</h1>
					<p className="import-flow__result-summary">
						{savedCount} menu item{savedCount === 1 ? '' : 's'} were successfully
						added to {menuTitle}.
					</p>
					{failedCount > 0 && (
						<p className="import-flow__result-fail">
							{failedCount} row{failedCount === 1 ? '' : 's'} could not be saved.
							Review and try another import pass.
						</p>
					)}
					<div className="import-flow__actions">
						<button
							type="button"
							className="button"
							onClick={() =>
								navigate('/menuitems', {
									state: { menuID: effectiveMenuId || rawMenuId || '', menuTitle },
								})
							}
						>
							Back to menu
						</button>
						<button type="button" className="button" onClick={backToIngest}>
							Import more
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (step === 'review') {
		return (
			<div className="import-flow">
				<div className="import-flow__panel import-flow__panel--wide" aria-busy={saveLoading}>
					<button
						type="button"
						className="import-flow__back"
						onClick={backToIngest}
					>
						Back
					</button>
					<h1 className="import-flow__title">Review imported items</h1>
					<p className="import-flow__sub">
						Target: {menuTitle} · Unselect any row you do not want. Parser
						suggested allergens are not saved until you confirm the checkbox
						and select database allergens to store.
					</p>
					{menuResolving && (
						<div className="import-flow__banner import-flow__banner--info" role="status">
							Looking up your menu so items save to the right place…
						</div>
					)}
					{!menuResolving && !effectiveMenuId && businessId && (
						<div className="import-flow__banner import-flow__banner--warn" role="alert">
							Could not resolve a menu for your business. Open{' '}
							<strong>Menu items</strong> from the nav, wait for the page to
							load, then return here—or sign in again.
						</div>
					)}
					{partialParse && parseInfo?.summary && (
						<div className="import-flow__warn" role="status">
							Some rows need attention: {parseInfo.summary.invalidRows}{' '}
							invalid, {parseInfo.summary.duplicateRows} duplicate. Fix or
							leave unselected.
						</div>
					)}
					{parseInfo?.quality?.level === 'low' && (
						<div className="import-flow__warn import-flow__warn--quality" role="status">
							{parseInfo.quality.warning}
						</div>
					)}

					<ImportReviewTable
						rows={rows}
						onToggleSelect={toggleSelect}
						onFieldChange={onFieldChange}
						onAllergenIdsChange={onAllergenIds}
						onAllergenAckChange={onAllergenAck}
					/>

					<div className="import-flow__actions">
						<button
							type="button"
							className="button"
							onClick={handleSave}
							disabled={!canSubmitSave || saveLoading}
						>
							{saveLoading ? 'Saving…' : 'Save selected to menu'}
						</button>
					</div>
				</div>
			</div>
		);
	}

	/* step === 'ingest' */
	return (
		<div className="import-flow">
			<div className="import-flow__panel" aria-busy={ingestLoading}>
				<h1 className="import-flow__title">Import menu</h1>
				<p className="import-flow__sub">
					Add many items at once. After parsing, review every line before
					saving. Target menu: {menuTitle || '—'}
					{menuResolving && ' (resolving menu id…)'}
				</p>
				{ingestLoading && (
					<div className="import-flow__progress" role="status" aria-live="polite">
						<div className="import-flow__progressBar" />
						<p>{ingestStage || 'Working…'}</p>
					</div>
				)}

				<div className="import-flow__tabs" role="tablist" aria-label="Import source">
					<button
						type="button"
						className={
							ingestTab === 'file'
								? 'import-flow__tab import-flow__tab--active'
								: 'import-flow__tab'
						}
						role="tab"
						aria-selected={ingestTab === 'file'}
						onClick={() => setIngestTab('file')}
					>
						File
					</button>
					<button
						type="button"
						className={
							ingestTab === 'url'
								? 'import-flow__tab import-flow__tab--active'
								: 'import-flow__tab'
						}
						role="tab"
						aria-selected={ingestTab === 'url'}
						onClick={() => setIngestTab('url')}
					>
						URL
					</button>
					<button
						type="button"
						className={
							ingestTab === 'manual'
								? 'import-flow__tab import-flow__tab--active'
								: 'import-flow__tab'
						}
						role="tab"
						aria-selected={ingestTab === 'manual'}
						onClick={() => setIngestTab('manual')}
					>
						Manual
					</button>
				</div>

				{ingestTab === 'file' && (
					<div className="import-flow__body" role="tabpanel">
						<p id="import-file-help">
							Upload a text-based PDF, CSV, or Word document (max 5 MB).
						</p>
						<input
							type="file"
							accept=".pdf,.csv,.docx,application/pdf,text/csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
							onChange={onFileChange}
							disabled={ingestLoading}
							aria-describedby="import-file-help"
						/>
					</div>
				)}

				{ingestTab === 'url' && (
					<div className="import-flow__body" role="tabpanel">
						<p>Enter a public page URL. Private networks are blocked.</p>
						<div className="import-flow__urlRow">
							<input
								type="url"
								className="import-flow__urlInput"
								placeholder="https://example.com/menu"
								value={urlValue}
								onChange={(e) => setUrlValue(e.target.value)}
								disabled={ingestLoading}
								aria-label="Public menu URL"
							/>
							<button
								type="button"
								className="button"
								onClick={runUrlImport}
								disabled={ingestLoading}
							>
								{ingestLoading ? 'Loading…' : 'Import from URL'}
							</button>
						</div>
					</div>
				)}

				{ingestTab === 'manual' && (
					<div className="import-flow__body" role="tabpanel">
						<p>
							Add a single item with full control (same as the regular add
							flow).
						</p>
						<button type="button" className="button" onClick={goManual}>
							Open add item
						</button>
					</div>
				)}

				{ingestError && (
					<div className="import-flow__err" role="alert">
						<p>{ingestError.error || ingestError.message || 'Error'}</p>
						<p className="import-flow__fallback">
							{ingestError.fallback ||
								'Upload a file instead, or add items manually.'}
						</p>
						<div className="import-flow__fallbackActions">
							<button
								type="button"
								className="button"
								onClick={() => {
									setIngestTab('file');
									setIngestError(null);
								}}
							>
								Upload a file
							</button>
							<button type="button" className="button gray-btn" onClick={goManual}>
								Add manually
							</button>
						</div>
					</div>
				)}

				{ingestLoading && (
					<p className="import-flow__loading" aria-live="polite">
						This can take up to 20 seconds for larger files.
					</p>
				)}
			</div>
		</div>
	);
}

export default ImportMenuFlow;

import './Step3.scss';
import menuItemLayoutOption1 from '../../temp/menu-placeholder-right.jpg';
import menuItemLayoutOption2 from '../../temp/menu-placeholder-left.jpg';
import { useState } from 'react';

function Step3() {
	const [selectedOption, setSelectedOption] = useState(null);

	const handleOptionChange = (event) => {
		setSelectedOption(event.target.value); // Update the selected option
	};

	return (
		<>
			<h1>Add Menu Item Layout</h1>

			<form
				name='setUpStep3Form'
				className='step3-form'
			>
				<div className='question'>
					You will add menu items using this page later. Which layout do you
					prefer?
					<br />
					(select the picture)
				</div>

				<div className='menu-item-layout-container'>
					<label className='menu-item-layout-option'>
						<input
							type='radio'
							name='menuLayout'
							value='layout1'
							onChange={handleOptionChange}
							className='menu-item-layout-input'
						/>

						<img
							src={menuItemLayoutOption1}
							alt='Menu item layout 1'
							className={`menu-item-layout-image ${
								selectedOption === 'layout1' ? 'selected' : ''
							}`}
						/>
					</label>

					<label className='menu-item-layout-option'>
						<input
							type='radio'
							name='menuLayout'
							value='layout2'
							onChange={handleOptionChange}
							className='menu-item-layout-input'
						/>

						<img
							src={menuItemLayoutOption2}
							alt='Menu item layout 2'
							className={`menu-item-layout-image ${
								selectedOption === 'layout2' ? 'selected' : ''
							}`}
						/>
					</label>

					<div className='menu-item-layout-description'>
						This layout hides the ingredients and description sections by
						default.
					</div>

					<div className='menu-item-layout-description'>
						This layout displays the ingredients and description sections by
						deafult.
					</div>
				</div>
			</form>
		</>
	);
}

export default Step3;

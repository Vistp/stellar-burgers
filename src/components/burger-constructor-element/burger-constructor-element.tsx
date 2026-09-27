import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import type { BurgerConstructorElementProps } from './type';
import { useDispatch } from '@/services/store';
import { moveIngredientDown, moveIngredientUp, removeIngredient } from '@/services/slices/constructorSlice';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();

  const handleMoveDown = (): void => {
    dispatch(moveIngredientDown(index));
  };

  const handleMoveUp = (): void => {
    dispatch(moveIngredientUp(index));
  };

  const handleClose = (): void => {
    dispatch(removeIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});

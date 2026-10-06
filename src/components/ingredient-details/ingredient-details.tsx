import { getIngredientsState } from '@/services/slices/ingredientsSlice';
import { useSelector } from '@/services/store';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector(getIngredientsState);

  const ingredientData = useMemo(() =>
    ingredients.find((item) => item._id === id),
  [ingredients, id]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

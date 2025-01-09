import styled from 'styled-components';
import { typography } from './Variables';

export const Title = styled.h1`
  font-size: ${props => props.size || typography.sizes.xxl};
  font-weight: 500;
  letter-spacing: ${props => props.letterSpacing || '-3.25px'};
  line-height: ${props => props.lineHeight || typography.lineHeights.normal};
  margin: 0;
`;

export const HeroTitle = styled(Title)`
  font-size: ${typography.sizes.hero};
  letter-spacing: -3.575px;
  line-height: ${typography.lineHeights.hero};
`;

export const SectionTitle = styled(Title)`
  font-size: ${typography.sizes.xl};
  letter-spacing: -1.95px;
`;

export const Text = styled.p`
  font-size: ${props => props.size || typography.sizes.sm};
  line-height: ${props => props.lineHeight || typography.lineHeights.relaxed};
  margin: 0;
  ${props => props.maxWidth && `max-width: ${props.maxWidth}`};
  ${props => props.opacity && `opacity: ${props.opacity}`};
`;

export const SmallText = styled(Text)`
  font-size: ${typography.sizes.xs};
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  letter-spacing: ${props => props.letterSpacing || 'normal'};
`;

export const NavText = styled(Text)`
  font-size: ${typography.sizes.sm};
  font-weight: ${props => props.bold ? '500' : 'normal'};
  letter-spacing: ${props => props.letterSpacing || 'normal'};
`;
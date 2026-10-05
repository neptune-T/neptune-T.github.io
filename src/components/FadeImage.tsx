import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

// next/image that stays invisible until it has actually loaded, over an inline blurred
// placeholder. On a slow or failed request the placeholder is what people see, never a
// broken-image icon.
export default function FadeImage({
  placeholder,
  className = '',
  ...props
}: Omit<ImageProps, 'placeholder' | 'onLoad' | 'onError'> & { placeholder?: string }) {
  const [state, setState] = useState<'loading' | 'loaded' | 'failed'>('loading');

  return (
    <span
      className="absolute inset-0 block bg-line bg-cover bg-center dark:bg-dline"
      style={placeholder ? { backgroundImage: `url(${placeholder})` } : undefined}
    >
      <Image
        {...props}
        alt={props.alt}
        onLoad={() => setState('loaded')}
        onError={() => setState('failed')}
        className={`${className} transition-opacity duration-500 ${
          state === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </span>
  );
}

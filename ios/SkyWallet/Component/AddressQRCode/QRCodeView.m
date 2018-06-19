//
//  QRCodeView.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/25.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "QRCodeView.h"

@implementation QRCodeView
{
  UIImageView *qrImageView;
}

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    qrImageView = [[UIImageView alloc] initWithFrame:frame];
    
    qrImageView.backgroundColor = [UIColor yellowColor];
    [self addSubview:qrImageView];
    
    [qrImageView mas_makeConstraints:^(MASConstraintMaker *make) {
      make.edges.mas_equalTo(self);
    }];
  }
  
  return self;
}

- (void)setQrCodeString:(NSString *)qrCodeString {
  _qrCodeString = qrCodeString;
  UIImage *qrImage = [SWUtils qrCodeImageWithString:qrCodeString width:300 height:300];
  qrImageView.image = qrImage;
}

@end

//
//  LoadingView.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/19.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "LoadingView.h"
#import <QuartzCore/QuartzCore.h>

@interface LoadingView()
{
  UIActivityIndicatorView* activityView;
}
@end

@implementation LoadingView

- (id)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
    // Initialization code
    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    self.backgroundColor = [UIColor colorWithWhite: 0.8 alpha: 0.8];
    
    UIView* centerView = [[UIView alloc] initWithFrame: CGRectMake(0, 0, 100, 100)];
    centerView.autoresizingMask = UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleBottomMargin;
    centerView.center = self.center;
    centerView.backgroundColor = [UIColor colorWithRed:51.0f/255.0f green:51.0f/255.0f blue:51.0f/255.0f alpha:1.0];
    centerView.layer.cornerRadius = 10;
    [self addSubview: centerView];
    
    activityView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle: UIActivityIndicatorViewStyleWhiteLarge];
    activityView.center = CGPointMake(50, 50);
    activityView.color = [UIColor whiteColor];
    activityView.hidesWhenStopped = YES;
    [centerView addSubview: activityView];
    
  }
  return self;
}

-(void)show
{
  [activityView startAnimating];
  self.hidden = NO;
}

-(void)hide
{
  [activityView stopAnimating];
  self.hidden = YES;
}
@end

